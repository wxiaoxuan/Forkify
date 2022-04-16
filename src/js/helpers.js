import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// AJAX (combine both getJSON and sendJSON)
export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPromise = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    // Make an AJAX Request to an API
    const res = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);

    //convert to JSON
    const data = await res.json();

    //throw error message
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

/*
export const getJSON = async function (url) {
  try {
    const fetchPromise = fetch(url);
    // Make an AJAX Request to an API
    const res = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);

    //convert to JSON
    const data = await res.json();

    //throw error message
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPromise = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });

    // Make an AJAX Request to an API
    const res = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);

    //convert to JSON
    const data = await res.json();

    //throw error message
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

*/