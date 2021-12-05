import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';
require('dotenv').config();

const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const spreadsheetId = process.env.REACT_APP_SPREADSHEET_ID;

async function start() {
  // 2. Initialize the JavaScript client library.
  return await gapi.client.init({
    apiKey,
    discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    // clientId and scope are optional if auth is not required.
    clientId,
    scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
  });
}

function init() {
  try {
    gapi.load('client', start);
    if (!gapi.auth2 || !spreadsheetId) {
      ReactDOM.render(
        <React.StrictMode></React.StrictMode>,
        document.getElementById('root')
      );
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

    // If you want to start measuring performance in your app, pass a function
    // to log results (for example: reportWebVitals(console.log))
    // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
    reportWebVitals();
  } catch (error) {
    console.error(error);
  }
}

(() => {
  init();
})();
