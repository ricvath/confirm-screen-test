document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('checkin-form')) {
        initializeCheckInForm();
    } else if (window.location.pathname.endsWith('confirmation.html')) {
        populateData();
    }
});

function initializeCheckInForm() {
    const form = document.getElementById('checkin-form');
    const nameSelect = document.getElementById('name');
    const activitySelect = document.getElementById('activity');
    const locationSelect = document.getElementById('location');

    let data;

    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(jsonData => {
            data = jsonData;
            populateDropdowns(data, nameSelect, activitySelect);
            activitySelect.addEventListener('change', () => updateLocations(data, activitySelect, locationSelect));
        })
        .catch(error => console.error('Error loading data:', error));

    form.addEventListener('submit', handleFormSubmit);
}

function populateDropdowns(data, nameSelect, activitySelect) {
    data.name.forEach(name => addOption(nameSelect, name, name));
    Object.keys(data.activity).forEach(activity => addOption(activitySelect, activity, activity));
}

function addOption(selectElement, value, text) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = text;
    selectElement.appendChild(option);
}

function updateLocations(data, activitySelect, locationSelect) {
    const selectedActivity = activitySelect.value;
    locationSelect.innerHTML = '<option value="">Select...</option>';

    if (selectedActivity && data.activity[selectedActivity]) {
        data.activity[selectedActivity].forEach(location => {
            addOption(locationSelect, `${location.location},${location.district}`, `${location.location} ${location.district}`);
        });
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const activity = document.getElementById('activity').value;
    const location = document.getElementById('location').value;
    window.location.href = `confirmation.html?name=${encodeURIComponent(name)}&activity=${encodeURIComponent(activity)}&location=${encodeURIComponent(location)}`;
}

function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        name: params.get('name'),
        activity: params.get('activity'),
        location: params.get('location')
    };
}

function populateData() {
    const { name, activity, location } = getQueryParams();
    
    if (name && activity && location) {
        const [locationLeft, locationRight] = location.split(',');

        const nameElement = document.getElementById('name');
        if (nameElement) {
            nameElement.textContent = name;
        }

        const activityElements = ['activity', 'activity-mini'];
        activityElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.textContent = activity.charAt(0).toUpperCase() + activity.slice(1);
        });

        const activityImage = document.getElementById('activity-image');
        if (activityImage) {
            activityImage.src = `assets/img/${activity.toLowerCase().replace(/\s+/g, '_')}.jpg`;
        }

        const profilePhoto = document.getElementById('profile-photo');
        if (profilePhoto) {
            profilePhoto.src = `assets/img/${name.replace(/\s+/g, '_')}.jpg`;
        }

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

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered successfully:', registration.scope);
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
  });
}
