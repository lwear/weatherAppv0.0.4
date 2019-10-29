// server.js
// where your node.js app starts
// node.js is the software running on glitch.com that allows server side JavaScript

// initialize node.js modules required
const express = require("express");
const fetch = require("node-fetch");
const app = express();

// global constants
const FORECAST_DELAY = 20;
const API_KEY = process.env.DARKSKY_API_KEY; // accesses private api key stored in .env
//const API_KEY = "b29bbb18c441718a2f601b91c271f5ef"; // do this if .env doesn't work
const BASE_URL = "https://api.darksky.net/forecast"; // weather api

// https://api.darksky.net/forecast/b29bbb18c441718a2f601b91c271f5ef/48.4284,-123.3656
//const url = BASE_URL + "/" + API_KEY + "/28.6472799,76.8130727";

// start server
init();


/**
 * Get data from URL 
 * Asynchronous
 * If you use the async keyword before a function definition, you can then use await 
 * within the function. When you await a promise, the function is paused in a non-blocking 
 * way until the promise settles. If the promise fulfills, you get the value back. 
 * If the promise rejects, the rejected value is thrown.
 * More: https://hackernoon.com/understanding-async-await-in-javascript-1d81bb079b2c
 * https://hackernoon.com/understanding-promises-in-javascript-13d99df067c1
 */

async function getData (url) {
  try {
    const response = await fetch(url);
    const json = await response.json();
    return json;
  } catch (error) {
    return null;
  }
} //getData


/**
 * Initialize the app.
 *
 */
function init() {
  // tells server to access static pages in public folder
  // http://expressjs.com/en/starter/static-files.html
  app.use(express.static("public"));

  // Handle requests for the data
  // http://expressjs.com/en/starter/basic-routing.html
  app.get("/forecast/:location", getForecast);
  app.get("/forecast/", getForecast);
  app.get("/forecast", getForecast);

  // listen for requests :)
  const listener = app.listen(process.env.PORT, function() {
    console.log("Your app is listening on port " + listener.address().port);
  });

  //getData(url);
} //init

/**
 * Gets the weather forecast from the Dark Sky API for the given location.
 *
 *  req request object from Express.
 *  resp response object from Express.
 */

function getForecast(req, resp) {
  const location = req.params.location || '28.6472799,76.8130727';
  const url = BASE_URL + "/" + API_KEY + "/" + location;
  fetch(url)
    .then(resp => {
      if (resp.status !== 200) {
        throw new Error(resp.statusText);
      }
      return resp.json();
    })
    .then(data => {
      setTimeout(() => {
        resp.json(data);
      }, FORECAST_DELAY);
    })
    .catch(err => {
      console.error("Dark Sky API Error:", err.message);
      resp.send("dark sky api error");
      //resp.json(generateFakeForecast(location));
    });
}
