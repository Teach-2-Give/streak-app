interface Habit {
    id?: number;
    name: string;
    startDate: string;
}

class ActivityForm {
    private form: HTMLDivElement;

    constructor() {
        this.form = document.querySelector('.activity-card') as HTMLDivElement;
        this.initEventListeners();
    }

    private initEventListeners() {
        document.querySelector('.create-activity')?.addEventListener('click', () => this.showForm());
        document.querySelector('.cancel-button')?.addEventListener('click', () => this.hideForm());
        document.querySelector('#activityForm form')?.addEventListener('submit', (event) => this.submitForm(event));
    }

    private showForm() {
        this.form.style.display = 'block';
        this.form.classList.add('slide-in');
    }

    private hideForm() {
        this.form.classList.remove('slide-in');
        this.form.classList.add('slide-out');
        setTimeout(() => {
            this.form.style.display = 'none';
            this.form.classList.remove('slide-out');
        }, 500);
    }

    private submitForm(event: Event) {
        event.preventDefault();

        const nameInput = document.querySelector('#activityName') as HTMLInputElement;
        const startDateInput = document.querySelector('#startDate') as HTMLInputElement;

        const nameError = this.displayError('nameError', nameInput);
        const startDateError = this.displayError('startDateError', startDateInput);

        const name = nameInput.value;
        const startDate = startDateInput.value;

        if (!name) nameError.textContent = 'This field is required';
        if (!startDate) startDateError.textContent = 'This field is required';

        if (!name || !startDate) return;

        this.saveHabit({ name, startDate });
    }

    private displayError(errorId: string, inputElement: HTMLInputElement): HTMLParagraphElement {
        let errorElement = document.getElementById(errorId) as HTMLParagraphElement;

        if (!errorElement) {
            errorElement = document.createElement('p');
            errorElement.id = errorId;
            errorElement.style.color = 'red';
            inputElement.parentNode?.insertBefore(errorElement, inputElement.nextSibling);
        }

        inputElement.addEventListener('focus', () => errorElement.textContent = '');

        return errorElement;
    }

    private saveHabit(habit: Habit) {
        fetch('http://localhost:3000/habits', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(habit),
        })
            .then(response => response.json())
            .then(() => {
                ActivityGrid.fetchAndDisplayActivities();
                this.hideForm();
            })
            .catch(error => console.error('Error:', error));
    }
}

class ActivityGrid {
    private activityGrid: HTMLDivElement;

    constructor() {
        this.activityGrid = document.querySelector('.activity-grid') as HTMLDivElement;
    }

    static fetchAndDisplayActivities() {
        fetch('http://localhost:3000/habits')
            .then(response => response.json())
            .then((data: Habit[]) => {
                const activityGrid = new ActivityGrid();
                activityGrid.displayActivities(data);
            })
            .catch(error => console.error('Error:', error));
    }

    private displayActivities(data: Habit[]) {
        this.activityGrid.innerHTML = '';

        data.forEach(activity => {
            const activityDiv = this.createActivityElement(activity);
            this.activityGrid.appendChild(activityDiv);
        });
    }

    private createActivityElement(activity: Habit): HTMLDivElement {
        const activityDiv = document.createElement('div');
        activityDiv.className = 'activity';

        if (activity.name === 'Stop-Eating') {
            const icon = document.createElement('img');
            icon.src = 'https://cdn-icons-png.flaticon.com/512/2819/2819194.png';
            icon.alt = 'Anything Eatable';
            icon.style.height = '30px';
            icon.style.width = '30px';
            activityDiv.appendChild(icon);
        }

        const pName = document.createElement('p');
        pName.textContent = activity.name;
        pName.style.fontWeight = 'bold';
        activityDiv.appendChild(pName);

        const pCounter = document.createElement('p');
        pCounter.className = 'counter';
        pCounter.textContent = this.calculateDays(activity);
        pCounter.style.fontSize = '70px';
        pCounter.style.fontWeight = 'bold';
        activityDiv.appendChild(pCounter);

        const pStartDate = document.createElement('p');
        pStartDate.textContent = activity.name === 'Stop-Eating' ? 'I am yet to start' : activity.startDate;
        pStartDate.style.fontWeight = 'bold';
        activityDiv.appendChild(pStartDate);

        return activityDiv;
    }

    private calculateDays(activity: Habit): string {
        const currentDate = new Date();
        const startDateObj = new Date(activity.startDate);
        const diffTime = Math.abs(currentDate.getTime() - startDateObj.getTime());
        let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (activity.name === 'Stop-Eating') {
            diffDays = 0;
        }

        return diffDays.toString();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ActivityForm();
    ActivityGrid.fetchAndDisplayActivities();
});
