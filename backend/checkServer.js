const http = require('http');

const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/',
  method: 'GET'
};

const req = http.request(options, res => {
  console.log(`Server Status: ${res.statusCode}`);
  
  res.on('data', d => {
    console.log('Response:', d.toString());
  });
});

req.on('error', error => {
  console.error('Error:', error.message);
});

req.end(); 