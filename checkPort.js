// checkPort.js
const net = require('net');
const { exec } = require('child_process');

const PORT = 8081;

const server = net.createServer();
server.once('error', function(err) {
  if (err.code === 'EADDRINUSE') {
    console.error('Server is busy, we can\'t run the app');
    process.exit(1);
  } else {
    throw err;
  }
});

server.once('listening', function() {
  server.close();
  // Start Expo on port 8081
  exec('npx expo start --web --port 8081', (error, stdout, stderr) => {
    if (error) {
      console.error(`Expo failed: ${error.message}`);
      process.exit(1);
    }
    console.log(stdout);
    if (stderr) console.error(stderr);
  });
});

server.listen(PORT, '127.0.0.1');
