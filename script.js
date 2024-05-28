document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('checkin-form');
    const nameSelect = document.getElementById('name');
    const locationSelect = document.getElementById('location');

    // Fetch JSON data and populate dropdowns
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            // Populate names
            data.names.forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                nameSelect.appendChild(option);
            });

            // Populate locations
            data.locations.forEach(location => {
                const option = document.createElement('option');
                option.value = `${location.label},${location.value}`;
                option.textContent = `${location.label} ${location.value}`;
                locationSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error loading data:', error));

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = nameSelect.value;
            const location = locationSelect.value;
            window.location.href = `confirmation.html?name=${encodeURIComponent(name)}&location=${encodeURIComponent(location)}`;
        });
    }

    function getQueryParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            name: params.get('name'),
            location: params.get('location')
        };
    }

    function populateData() {
        const { name, location } = getQueryParams();
        if (name && location) {
            const [locationLeft, locationRight] = location.split(',');

            // Ensure only one element with id "name" is present and set the text content
            const nameElement = document.getElementById('name');
            if (nameElement) {
                nameElement.textContent = name;
            }

            // Set profile photo source
            const profilePhoto = document.getElementById('profile-photo');
            if (profilePhoto) {
                profilePhoto.src = `assets/img/${name.replace(' ', '_')}.jpg`;
            }

            // Set location text content
            const locationLeftElement = document.getElementById('location-left');
            const locationRightElement = document.getElementById('location-right');
            if (locationLeftElement) {
                locationLeftElement.textContent = locationLeft;
            }
            if (locationRightElement) {
                locationRightElement.textContent = locationRight;
            }
        }
    }

    // Ensure this function runs only on the confirmation page
    if (window.location.pathname.endsWith('confirmation.html')) {
        populateData();
    }
});



//Animations
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