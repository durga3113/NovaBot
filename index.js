const forever = require('forever');
const { DATABASEURL } = process.env;
const { sequelize } = require('./config.js');

console.log("Sync Database");
console.log("Connected to SQL data");

(async () => {
  try {
    const novaInit = require('./core.js');
    await novaInit.startNova(DATABASEURL);
  } catch (error) {
    console.error("failed:", error);
    process.exit(1);
  }
})();

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = server;

await { max: 5 };
