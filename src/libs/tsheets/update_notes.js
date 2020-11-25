import config from './get_configuration';

export default function updateNotes(request, sendResponse) {
  console.log('Message: Updating notes');
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
      id: request.updateNotes.timesheetId,
      notes: request.updateNotes.notes,
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
