const forever = require('forever');
const { DATABASEURL } = require('./config.js');
const { Sequelize } = require('sequelize');

console.log("Sync Database");
console.log("Connected to SQL data");

(async () => {
  try {
    const { nova } = require('./lib/novaBot.js');
    const { startNova } = require("./core.js");
    await startNova(DATABASEURL);
    await DATABASEURL.sync();
  } catch (error) {
    console.error("failed:", error);
    process.exit(1);
  } 
})();

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
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
      console.error(`Retrying... (${retries + 1}/${maxes})`);
      retries++;
      await new Promise(resolve => setTimeout(resolve, 1000)); 
    }

  if (!authenticated) {
    console.error(`Failed ${maxes} attempts. Exiting...`);
    process.exit(1);
  }
  
  start();
}

authenticateRetry();
