const jokeForm = document.getElementById('postform');
const formButtons = document.querySelectorAll('form button');
const formError = document.getElementById('form-error-text');
const anyCheckbox = document.querySelectorAll('.checkbox-category[value="any"]')[0];
const otherCheckboxes = document.querySelectorAll('.checkbox-category:not([value="any"])');

[jokeForm, ...formButtons].forEach(element => {
    element.addEventListener('click', function () {
        formError.style.display = 'none';
    });
});

anyCheckbox.addEventListener('change', function () {
    if (anyCheckbox.checked) {
        otherCheckboxes.forEach(checkbox => checkbox.checked = false);
    }
    else {
        anyCheckbox.checked = true;
    }
});

otherCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function () {
        if (checkbox.checked) {
            anyCheckbox.checked = false;
        }
    });
});
