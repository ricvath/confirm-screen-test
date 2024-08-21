document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('checkin-form');
    const sportTypeSelect = document.getElementById('sportType');
    const locationSelect = document.getElementById('location');
    const nameSelect = document.getElementById('name');

    let data;

    // Fetch JSON data and populate dropdowns
    fetch('data.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            populateSportTypes();
            populateNames();
        })
        .catch(error => console.error('Error loading data:', error));

    function populateSportTypes() {
        const sportTypes = Object.keys(data.sportType);
        sportTypes.forEach(sport => {
            const option = document.createElement('option');
            option.value = sport;
            option.textContent = sport.charAt(0).toUpperCase() + sport.slice(1);
            sportTypeSelect.appendChild(option);
        });
    }

    function populateNames() {
        data.names.forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            nameSelect.appendChild(option);
        });
    }

    function populateLocations(sport) {
        locationSelect.innerHTML = '<option value="">Select...</option>';
        data.sportType[sport].forEach(location => {
            const option = document.createElement('option');
            option.value = `${location.label},${location.value}`;
            option.textContent = `${location.label} ${location.value}`;
            locationSelect.appendChild(option);
        });
    }

    sportTypeSelect.addEventListener('change', function() {
        const selectedSport = this.value;
        if (selectedSport) {
            populateLocations(selectedSport);
            locationSelect.disabled = false;
        } else {
            locationSelect.innerHTML = '<option value="">Select...</option>';
            locationSelect.disabled = true;
        }
    });

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = nameSelect.value;
            const sportType = sportTypeSelect.value;
            const location = locationSelect.value;
            const [locationLabel, locationValue] = location.split(',');
            const url = `confirmation.html?name=${encodeURIComponent(name)}&sportType=${encodeURIComponent(sportType)}&locationLabel=${encodeURIComponent(locationLabel)}&locationValue=${encodeURIComponent(locationValue)}`;
            window.location.href = url;
        });
    }

    function getQueryParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            name: params.get('name'),
            sportType: params.get('sportType'),
            locationLabel: params.get('locationLabel'),
            locationValue: params.get('locationValue')
        };
    }

    function populateData() {
        const { name, sportType, locationLabel, locationValue } = getQueryParams();

        if (name && sportType && locationLabel && locationValue) {
            // Set name
            const nameElement = document.getElementById('name');
            if (nameElement) {
                nameElement.textContent = name;
            }

            // Set profile photo
            const profilePhoto = document.getElementById('profile-photo');
            if (profilePhoto) {
                const formattedName = name.toLowerCase().replace(' ', '_');
                profilePhoto.src = `assets/img/${formattedName}.jpg`;
                profilePhoto.onerror = function() {
                    this.src = 'assets/img/default_profile.jpg';
                };
            }

            // Set sport type and activity image
            const activityNameElement = document.querySelector('.activity-name');
            const activityImageElement = document.querySelector('.activity-image');
            const activityNameMiniElement = document.getElementById('activity-name-mini');
            if (activityNameElement) {
                activityNameElement.textContent = sportType.charAt(0).toUpperCase() + sportType.slice(1);
            }
            if (activityImageElement) {
                activityImageElement.src = `assets/img/${sportType.toLowerCase()}.jpg`;
            }
            if (activityNameMiniElement) {
                activityNameMiniElement.textContent = sportType.charAt(0).toUpperCase() + sportType.slice(1);
            }

            // Set location
            const locationLeftElement = document.getElementById('location-left');
            const locationRightElement = document.getElementById('location-right');
            if (locationLeftElement) {
                locationLeftElement.textContent = locationLabel;
            }
            if (locationRightElement) {
                locationRightElement.textContent = locationValue;
            }

            // Set date and time
            const dateTimeElement = document.getElementById('date-time');
            if (dateTimeElement) {
                const now = new Date();
                const dateOptions = { day: '2-digit', month: 'short' };
                const dateString = now.toLocaleDateString('en-GB', dateOptions);
                const timeString = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
                dateTimeElement.textContent = `${dateString}, ${timeString}`;
            }
        }
    }

    // Call populateData when the confirmation page loads
    if (window.location.pathname.endsWith('confirmation.html')) {
        document.addEventListener('DOMContentLoaded', populateData);
    }
});