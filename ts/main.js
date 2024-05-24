document.querySelector('.create-activity').addEventListener('click', function() {
    var form = document.querySelector('.activity-card');
    form.style.display = 'block';
    form.classList.add('slide-in');
});

document.querySelector('.cancel-button').addEventListener('click', function() {
    var form = document.querySelector('.activity-card');
    form.classList.remove('slide-in');
    form.classList.add('slide-out');
    setTimeout(function() {
        form.style.display = 'none';
        form.classList.remove('slide-out');
    }, 500);
});

function fetchAndDisplayActivities() {
    fetch('http://localhost:3000/habits')
    .then(response => response.json())
    .then(data => {
        var activityGrid = document.querySelector('.activity-grid');
        activityGrid.innerHTML = '';

        data.forEach(activity => {
            var activityDiv = document.createElement('div');
            activityDiv.className = 'activity';

            var pName = document.createElement('p');
            pName.textContent = activity.name;
            pName.style.fontWeight = 'bold';
            activityDiv.appendChild(pName);

            var pCounter = document.createElement('p');
            pCounter.className = 'counter';
            var currentDate = new Date();
            var startDateObj = new Date(activity.startDate);
            var diffTime = Math.abs(currentDate - startDateObj);
            var diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 

            
            if (activity.name === 'Stop-Eating') {
                diffDays = 0;
            }

            pCounter.textContent = diffDays;
            pCounter.style.fontSize = '70px';
            pCounter.style.fontWeight = 'bold';
            activityDiv.appendChild(pCounter);

            var pStartDate = document.createElement('p');

            
            if (activity.name === 'Stop-Eating') {
                pStartDate.textContent = "I am yet to start";
            } else {
                pStartDate.textContent = activity.startDate;
            }

            pStartDate.style.fontWeight = 'bold';
            activityDiv.appendChild(pStartDate);

            activityGrid.appendChild(activityDiv);
        });
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

document.addEventListener('DOMContentLoaded', fetchAndDisplayActivities);


var nameError = document.createElement('p');
nameError.style.color = 'red';
var nameInput = document.querySelector('#activityName');
nameInput.parentNode.insertBefore(nameError, nameInput.nextSibling);

var startDateError = document.createElement('p');
startDateError.style.color = 'red';
var startDateInput = document.querySelector('#startDate');
startDateInput.parentNode.insertBefore(startDateError, startDateInput.nextSibling);


nameInput.addEventListener('focus', function() {
    nameError.textContent = '';
});

startDateInput.addEventListener('focus', function() {
    startDateError.textContent = '';
});

document.querySelector('#activityForm form').addEventListener('submit', function(event) {
    event.preventDefault();

    var name = nameInput.value;
    var startDate = startDateInput.value;


    nameError.textContent = '';
    startDateError.textContent = '';


    if (!name) {
        nameError.textContent = 'This field is required';
    }

    if (!startDate) {
        startDateError.textContent = 'This field is required';
    }

    if (!name || !startDate) {
        return;
    }

    fetch('http://localhost:3000/habits', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name,
            startDate: startDate,
        }),
    })
    .then(response => response.json())
    .then(data => {
        fetchAndDisplayActivities();
        hideForm();
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

function hideForm() {
    var form = document.querySelector('.activity-card');
    form.classList.remove('slide-in');
    form.classList.add('slide-out');
    setTimeout(function() {
        form.style.display = 'none';
        form.classList.remove('slide-out');
    }, 500);
}