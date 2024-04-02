const forever = require('forever');
const { logMessage } = require('./lib/assets/client.js');
const { DATABASEURL } = require('./config.js');
const { Sequelize } = require('sequelize');

logMessage('info', 'Sync Database');
logMessage('info', 'Connected to SQL data');

(async () => {
  try {
    const { startNova } = require("./lib/core.js");
    await startNova(DATABASEURL);
    await DATABASEURL.sync();
  } catch (error) {
    logMessage('error', 'failed': error);
    process.exit(1);
  } 
})();

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  logMessage('info', `Listening on port ${port}`);
});

async function authenticateRetry() {
  const maxes = 5;
  let retries = 0;
  let authenticated = false;

  while (retries < maxes && !authenticated) {
    try {
      await DATABASEURL.authenticate();
      authenticated = true;
    } catch (error) {
      logMessage('error', `Retrying... (${retries + 1}/${maxes})`);
      retries++;
      await new Promise(resolve => setTimeout(resolve, 1000)); 
    }

    if (!authenticated) {
      logMessage('error', `Failed ${maxes} attempts. Exiting...`);
      process.exit(1);
    }
  }
}

authenticateRetry();
