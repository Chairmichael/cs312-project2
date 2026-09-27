const anyCheckbox = document.querySelectorAll('.checkbox-category[value="any"]')[0];
const otherCheckboxes = document.querySelectorAll('.checkbox-category:not([value="any"])');

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
