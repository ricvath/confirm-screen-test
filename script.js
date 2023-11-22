window.onload = function () {
  var seconds = 0;
  var minutes = 0;
  var timerElement = document.getElementById('timer');

  var dateTimeParagraph = document.getElementById('date-time');
  var now = new Date();
  var dateOptions = { day: '2-digit', month: 'short' };
  var dateString = now.toLocaleDateString('en-GB', dateOptions);
  var timeString = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  dateString = dateString.replace(/,.*$/, "");
  dateTimeParagraph.textContent = dateString + ', ' + timeString;

  function updateTimer() {
    seconds++;
    if (seconds == 60) {
      minutes++;
      seconds = 0;
    }
    if (minutes == 60) {
      minutes = 0;
    }
    timerElement.textContent = (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }

  // Start the timer when the page loads
  setInterval(updateTimer, 1000);
};
