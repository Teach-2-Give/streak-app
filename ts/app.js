var ActivityForm = /** @class */ (function () {
    function ActivityForm() {
        this.form = document.querySelector('.activity-card');
        this.initEventListeners();
    }
    ActivityForm.prototype.initEventListeners = function () {
        var _this = this;
        var _a, _b, _c;
        (_a = document.querySelector('.create-activity')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () { return _this.showForm(); });
        (_b = document.querySelector('.cancel-button')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function () { return _this.hideForm(); });
        (_c = document.querySelector('#activityForm form')) === null || _c === void 0 ? void 0 : _c.addEventListener('submit', function (event) { return _this.submitForm(event); });
    };
    ActivityForm.prototype.showForm = function () {
        this.form.style.display = 'block';
        this.form.classList.add('slide-in');
    };
    ActivityForm.prototype.hideForm = function () {
        var _this = this;
        this.form.classList.remove('slide-in');
        this.form.classList.add('slide-out');
        setTimeout(function () {
            _this.form.style.display = 'none';
            _this.form.classList.remove('slide-out');
        }, 500);
    };
    ActivityForm.prototype.submitForm = function (event) {
        event.preventDefault();
        var nameInput = document.querySelector('#activityName');
        var startDateInput = document.querySelector('#startDate');
        var nameError = this.displayError('nameError', nameInput);
        var startDateError = this.displayError('startDateError', startDateInput);
        var name = nameInput.value;
        var startDate = startDateInput.value;
        if (!name)
            nameError.textContent = 'This field is required';
        if (!startDate)
            startDateError.textContent = 'This field is required';
        if (!name || !startDate)
            return;
        this.saveHabit({ name: name, startDate: startDate });
    };
    ActivityForm.prototype.displayError = function (errorId, inputElement) {
        var _a;
        var errorElement = document.getElementById(errorId);
        if (!errorElement) {
            errorElement = document.createElement('p');
            errorElement.id = errorId;
            errorElement.style.color = 'red';
            (_a = inputElement.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(errorElement, inputElement.nextSibling);
        }
        inputElement.addEventListener('focus', function () { return errorElement.textContent = ''; });
        return errorElement;
    };
    ActivityForm.prototype.saveHabit = function (habit) {
        var _this = this;
        fetch('http://localhost:3000/habits', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(habit),
        })
            .then(function (response) { return response.json(); })
            .then(function () {
            ActivityGrid.fetchAndDisplayActivities();
            _this.hideForm();
        })
            .catch(function (error) { return console.error('Error:', error); });
    };
    return ActivityForm;
}());
var ActivityGrid = /** @class */ (function () {
    function ActivityGrid() {
        this.activityGrid = document.querySelector('.activity-grid');
    }
    ActivityGrid.fetchAndDisplayActivities = function () {
        fetch('http://localhost:3000/habits')
            .then(function (response) { return response.json(); })
            .then(function (data) {
            var activityGrid = new ActivityGrid();
            activityGrid.displayActivities(data);
        })
            .catch(function (error) { return console.error('Error:', error); });
    };
    ActivityGrid.prototype.displayActivities = function (data) {
        var _this = this;
        this.activityGrid.innerHTML = '';
        data.forEach(function (activity) {
            var activityDiv = _this.createActivityElement(activity);
            _this.activityGrid.appendChild(activityDiv);
        });
    };
    ActivityGrid.prototype.createActivityElement = function (activity) {
        var activityDiv = document.createElement('div');
        activityDiv.className = 'activity';
        if (activity.name === 'Stop-Eating') {
            var icon = document.createElement('img');
            icon.src = 'https://cdn-icons-png.flaticon.com/512/2819/2819194.png';
            icon.alt = 'Anything Eatable';
            icon.style.height = '30px';
            icon.style.width = '30px';
            activityDiv.appendChild(icon);
        }
        var pName = document.createElement('p');
        pName.textContent = activity.name;
        pName.style.fontWeight = 'bold';
        activityDiv.appendChild(pName);
        var pCounter = document.createElement('p');
        pCounter.className = 'counter';
        pCounter.textContent = this.calculateDays(activity);
        pCounter.style.fontSize = '70px';
        pCounter.style.fontWeight = 'bold';
        activityDiv.appendChild(pCounter);
        var pStartDate = document.createElement('p');
        pStartDate.textContent = activity.name === 'Stop-Eating' ? 'I am yet to start' : activity.startDate;
        pStartDate.style.fontWeight = 'bold';
        activityDiv.appendChild(pStartDate);
        return activityDiv;
    };
    ActivityGrid.prototype.calculateDays = function (activity) {
        var currentDate = new Date();
        var startDateObj = new Date(activity.startDate);
        var diffTime = Math.abs(currentDate.getTime() - startDateObj.getTime());
        var diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        if (activity.name === 'Stop-Eating') {
            diffDays = 0;
        }
        return diffDays.toString();
    };
    return ActivityGrid;
}());
document.addEventListener('DOMContentLoaded', function () {
    new ActivityForm();
    ActivityGrid.fetchAndDisplayActivities();
});
