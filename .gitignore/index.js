// In this application we will be using the built in HTTP request objects packaged with node.js
// I will not be using Express package as it will be overkill to make these basic http requests
// with Axios.
const createServer = require('http').createServer;
const url = require('url');
const axios = require('axios');
const chalk = require('chalk');
const config = require('./config');

// Create an object that will contain all the header info sent back to the front end from my server
const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET'
};

// Create a helper function to help decode the parameters from the URL when they are sent
// Ex: convert '?search=php&location=london' into an object with key value pairs
const decodeParams = searchParams =>
  Array.from(searchParams.keys()).reduce(
    (acc, key) => ({ ...acc, [key]: searchParams.get(key) }),
    {}
  );

// Set up my server
const server = createServer((req, res) => {
  // Server looking for URL coming from client
  const requestURL = url.parse(req.url);

  // { search: 'php', location: 'london' }
  const decodedParams = decodeParams(new URLSearchParams(requestURL.search));
  const { search, location, country = 'us' } = decodedParams;

  // See adzuna api documention for more details
  const targetURL = `${config.BASE_URL}/${country.toLowerCase()}/${
    config.BASE_PARAMS
  }&app_id=${config.APP_ID}&app_key=${
    config.API_key
  }&what=${search}&where=${location}`;

  if (req.method === 'GET') {
    console.log(chalk.green(`Proxy GET request to : ${targetURL}`));
    axios
      .get(targetURL)
      .then(response => {
        res.writeHead(200, headers);
        res.end(JSON.stringify(response.data));
      })
      .catch(error => {
        console.log(chalk.red(error));
        res.writeHead(500, headers);
        res.end(JSON.stringify(error));
      });
  }
});

server.listen(3000, () => console.log(chalk.green('Server listening...')));
