import Moment from 'moment';
import config from './get_configuration';

/**
 * A request to clock in/out
 * @typedef {Object} ClockRequest
 * @property {number} timesheetId           - Which timesheet to clock out of
 */

const ORIGIN_HINT = 'Desk Dashboard';

/**
 * Sends an API request to the TSheets API to clock in
 * @param {object} request                  - The request information
 * @param {ClockRequest} request.clockIn    - If this is at the root of the object this will run
 * @param {*} _sender                       - Unused, the sender of the request
 * @param {function} sendResponse           - Callback for the response
 */
function clockIn(request, sendResponse) {
  console.log('Message: Clocking in');

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

  const data = JSON.stringify({
    data: [{
      user_id: items.tsheets_user_id,
      jobcode_id: request.clockIn.jobId,
      type: 'regular',
      start: new Moment().format('Y-MM-DDTHH:mm:ssZ'),
      end: '',
      origin_hint_start: ORIGIN_HINT,
    }],
  });

  fetch(`${config.proxied_base_url}/timesheets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${items.tsheets_token}`,
    },
    body: data,
  }).then((response) => {
    if (response.status !== 200) {
      sendResponse({
        error: {
          statusCode: response.status,
          message: `Got response with code ${response.status}`,
        },
      });
    } else {
      sendResponse({ success: '' });
    }
  });
}

/**
 * Clock out
 * @param {object} request                  - The request informtion
 * @param {ClockRequest} request.clockOut   - If this is at the root of the object this will run
 * @param {*} _sender                       - Unused, sender of the request
 * @param {function} sendResponse           - Callback for the response
 */
function clockOut(request, sendResponse) {
  console.log('Message: Clocking out');
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

  const data = JSON.stringify({
    data: [{
      id: request.clockOut.timesheetId,
      end: new Moment().format('Y-MM-DDTHH:mm:ssZ'),
      origin_hint_end: ORIGIN_HINT,
    }],
  });

  fetch(`${config.proxied_base_url}/timesheets`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${items.tsheets_token}`,
    },
    body: data,
  }).then((response) => {
    if (response.status !== 200) {
      sendResponse({
        error: {
          statusCode: response.status,
          message: `Got response with code ${response.status}`,
        },
      });
    } else {
      sendResponse({ success: '' });
    }
  });
}

export { clockIn, clockOut };
