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