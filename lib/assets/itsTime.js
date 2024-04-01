// itsTime

function formatUptime(seconds) {
  const currentDate = new Date();
  const totalMilliseconds = seconds * 1000;
  const uptimeDate = new Date(currentDate - totalMilliseconds);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeek = days[uptimeDate.getDay()];
  const daysElapsed = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return { daysElapsed, dayOfWeek, hours, minutes };
}

module.exports = {
  getUpTime: formatUptime
};
