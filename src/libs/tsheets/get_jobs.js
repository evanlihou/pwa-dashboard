import formatGetParams from '../formatGetParams';
import config from './get_configuration';

/**
 * A request to get job IDs
 * @typedef {Object} JobsRequest
 * @property {string} token                 - Token to use to get jobs, saved value if blank
 * @property {number} userId                - User ID to get jobs for, saved ID if blank
 */

/**
 * Sends an API request to the TSheets API to clock in
 * @param {object} request                  - The request information
 * @param {JobsRequest} request.getJobs    - If this is at the root of the object this will run
 * @param {*} _sender                       - Unused, the sender of the request
 * @param {function} sendResponse           - Callback for the response
 */
function getJobs(request, sendResponse) {
  console.log('Message: Getting Jobs');

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

  const data = {
    user_ids: request.userId != null ? request.userId : items.tsheets_user_id,
    supplemental_data: 'yes',
    active: 'yes',
  };

  fetch(`${config.proxied_base_url}/jobcode_assignments${formatGetParams(data)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${items.tsheets_token}`,
    },
  }).then((response) => {
    if (!response.ok) {
      sendResponse({
        error: {
          statusCode: response.status,
          message: `Got response with code ${response.status}`,
        },
      });

      throw new Error('Bad response code');
    } else {
      return response.json();
    }
  }).then((response) => {
    const jobs = [];
    Object.entries(response.results.jobcode_assignments).forEach(([, assignment]) => {
      // Ignore jobs not assigned to the user (for some reason they get returned?)
      if (response.results.jobcode_assignments[assignment].user_id !== items.tsheets_user_id) {
        return;
      }
      const job = response
        .supplemental_data
        .jobcodes[response.results.jobcode_assignments[assignment].jobcode_id];
      jobs.push({
        id: job.id,
        name: job.name,
        type: job.type,
      });
    });
    sendResponse({
      jobs,
    });
  });
}

export default getJobs;
