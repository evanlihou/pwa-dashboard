import Cache from './cache';
import config from './get_configuration';

const CACHE = new Cache();

// Helper to convert the number of seconds returned by TSheets into a format
// that's easy to display
function secondsToHumanReadable(seconds) {
  const numMinutes = Math.round(seconds / 60) % 60;
  const numHours = Math.max(Math.floor(seconds / 60 / 60), 0);
  return `${numHours}:${numMinutes < 10 ? `0${numMinutes}` : numMinutes}`;
}

function dateToISODateString(date) {
  return date.toISOString().slice(0, 10);
}

function callApiForCurrent(sendResponse) {
  const items = {
    tsheets_token: config.key,
    tsheets_user_id: config.userid,
  };
  if (!items.tsheets_token) {
    sendResponse({
      error: {
        message: 'One or more configuration values were empty. Please ensure extension options are set.',
      },
    });
    return;
  }

  const start = new Date();
  start.setHours(-24 * start.getDay());

  const end = new Date(new Date(start).setDate(start.getDate() + 6));

  const tsheetsHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${items.tsheets_token}`,
  };

  const apiCallPromises = [
    fetch(`${config.proxied_base_url}/reports/current_totals`, {
      method: 'POST',
      headers: tsheetsHeaders,
      body: JSON.stringify({
        data: {
          on_the_clock: 'both',
          user_ids: items.tsheets_user_id,
        },
      }),
    }).then(resp => resp.json()),
    fetch(`${config.proxied_base_url}/reports/payroll`, {
      method: 'POST',
      headers: tsheetsHeaders,
      // mode: 'no-cors',
      body: JSON.stringify({
        data: {
          user_ids: items.tsheets_user_id,
          start_date: dateToISODateString(start),
          end_date: dateToISODateString(end),
        },
      }),
    }).then(resp => resp.json()),
  ];

  Promise.all(apiCallPromises).then(([currentTotalsResponse, payrollResponse]) => {
    let timesheet = null;
    if (currentTotalsResponse.supplemental_data.timesheets) {
      timesheet = currentTotalsResponse
        .supplemental_data
        .timesheets[
          currentTotalsResponse.results.current_totals[items.tsheets_user_id].timesheet_id
        ];
    }

    let weekTotalSeconds = 0;
    weekTotalSeconds += payrollResponse.results.payroll_report[items.tsheets_user_id]
      ? payrollResponse.results.payroll_report[items.tsheets_user_id].total_work_seconds
      : 0;
    weekTotalSeconds += currentTotalsResponse
      .results.current_totals[items.tsheets_user_id].shift_seconds;

    const retVal = {
      status: {
        timesheetId: currentTotalsResponse
          .results.current_totals[items.tsheets_user_id].timesheet_id,
        clockedIn: currentTotalsResponse.results.current_totals[items.tsheets_user_id].on_the_clock,
        start: timesheet ? timesheet.start : null,
        end: timesheet ? timesheet.end : null,
        shift_time: secondsToHumanReadable(
          currentTotalsResponse.results.current_totals[items.tsheets_user_id].shift_seconds,
        ),
        shift_notes: timesheet ? timesheet.notes : null,
      },
      totals: {
        week: secondsToHumanReadable(weekTotalSeconds),
        day: secondsToHumanReadable(
          currentTotalsResponse.results.current_totals[items.tsheets_user_id].day_seconds,
        ),
      },
    };

    if (retVal.status.clockedIn) {
      retVal.status.jobName = currentTotalsResponse
        .supplemental_data.jobcodes[timesheet.jobcode_id].name;
    }

    const fieldItemPromises = [];
    if (currentTotalsResponse.results.current_totals[items.tsheets_user_id].on_the_clock
      && timesheet
      && timesheet.customfields
      && currentTotalsResponse.supplemental_data.customfields) {
      retVal.customFields = {};
      Object.entries(timesheet.customfields).forEach(([key, val]) => {
        const fieldInfo = currentTotalsResponse.supplemental_data.customfields[key];
        retVal.customFields[key] = {
          name: fieldInfo.name,
          shortCode: fieldInfo.short_code,
          type: fieldInfo.ui_preference,
          value: val,
        };
        if (fieldInfo.ui_preference === 'drop_down') {
          // Get options
          retVal.customFields[key].options = [];
          fieldItemPromises.push(fetch(`${config.proxied_base_url}/customfielditems?customfield_id=${key}`, {
            method: 'GET',
            headers: tsheetsHeaders,
          }).then(resp => resp.json()).then((resp) => {
            Object.entries(resp.results.customfielditems).forEach(([, opt]) => {
              retVal.customFields[key].options.push({
                id: opt.id,
                text: opt.name,
              });
            });
          }));
        }
      });
    }
    Promise.all(fieldItemPromises).then(() => {
      sendResponse(retVal);
      CACHE.data = retVal;
    });
  });
}

export default function getCurrentStatus(sendResponse) {
  // Sometimes the message will send twice. Cache it for a bit to keep API usage down
  if (CACHE.loading === true) { CACHE.addCallback(sendResponse); return true; }
  if (CACHE.data !== null) { sendResponse(CACHE.data); }

  // Action
  CACHE.loading = true;
  callApiForCurrent(sendResponse);
  return true;
}
