import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';
require('dotenv').config();

const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const searchParams = new URLSearchParams(window.location.search);
const spreadsheetId = searchParams.has('spreadsheet_id')
  ? searchParams.get('spreadsheet_id')
  : process.env.REACT_APP_SPREADSHEET_ID;

async function start() {
  return await gapi.client.init({
    apiKey,
    discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    clientId,
    scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
  });
}

function init() {
  try {
    gapi.load('client', start);
    if (!gapi.auth2 || !spreadsheetId) {
      ReactDOM.render(<></>, document.getElementById('root'));
      setTimeout(init, 1000);
      return;
    }
    const authInstance = gapi.auth2.getAuthInstance();
    ReactDOM.render(
      <React.StrictMode>
        {authInstance ? (
          <App authInstance={authInstance} spreadsheetId={spreadsheetId} />
        ) : null}
      </React.StrictMode>,
      document.getElementById('root')
    );

    reportWebVitals();
  } catch (error) {
    console.error(error);
  }
}

(() => {
  init();
})();
