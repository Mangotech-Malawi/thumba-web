import { notify } from "../services/utils.js"

export function validate(formElements) {
    // Array to store validation messges
    let validationMessages = [];

    //Check for different validations

    formElements.some(element => {
        let inputVal = $(element.id).val();

        if (element.checkIsFilled) {
            if (inputVal === '' || typeof inputVal == undefined || typeof inputVal == "undefined") {
                showError(element.name, `Please fill ${element.name}`);
                return true; // Break the loop if validation fails
            }
        }


        if (typeof inputVal !== '' && typeof inputVal !== undefined) {
            if (element.type === "email") {
                if (!checkMail(inputVal)) {
                    showError(element.name, `Please enter valid email address`);
                    return true; // Break the loop if validation fails
                }
            }

            if (element.type === "phoneNumber") {
                if (!validateMalawianPhoneNumber(inputVal)) {
                    showError(element.name, `Please enter valid phone number`);
                    return true; // Break the loop if validation fails
                }
            }

            if (element.type === "personName") {
                if (!validatePersonName(inputVal)) {
                    showError(element.name, `Please enter valid person name`);
                    return true; // Break the loop if validation fails
                }
            }

            if (element.type === "moneyAmount") {
                if (!validateMoneyAmount(inputVal)) {
                    showError(element.name, `Please enter correct monetary value`);
                    return true; // Break the loop if validation fails
                }
            }

            if (element.type === "dateOfBirth") {
                if (!validateDateOfBirth(inputVal)) {
                    showError(element.name, `Date Of Birth can only be 18 years ago and above`);
                    return true; // Break the loop if validation fails
                }
            }

            if (element.type === "village") {
                if (!validateVillage(inputVal)) {
                    showError(element.name, `Enter valid village name`);
                    return true; // Break the loop if validation fails
                }
            }

            if (element.type === "ta") {
                if (!validateTraditionalAuthority(inputVal)) {
                    showError(element.name, `Please enter valid traditional authority`);
                    return true; // Break the loop if validation fails
                }
            }

            if (element.type === "alphanum") {
                if (!validateAlphanumeric(inputVal)) {
                    showError(element.name, `Please enter only alphanumerics for ${element.name}`);
                    return true; // Break the loop if validation fails
                }
            }

            if (element.type === "description") {
                if (!validateDescription(inputVal)) {
                    showError(element.name, `Please enter correct description for ${element.name}`);
                    return true; // Break the loop if validation fails
                }
            }

            if (element.type === "startDate") {
                if (!validateStartDate(inputVal)) {
                    showError(element.name, `${element.name} Date cannot be in the future`);
                    return true; // Break the loop if validation fails
                }
            }

            if (element.type === "alphabeticStringWithSpace") {
                if (!validateAlphabeticStringWithSpace(inputVal)) {
                    showError(element.name, `${element.name} should have only alphabetics with spaces`);
                    return true; // Break the loop if validation fails
                }
            }

            if (element.type === "futureDate") {
                if (!validateFutureDate(inputVal)) {
                    showError(element.name, `${element.name} cannot be in the future`);
                    return true; // Break the loop if validation fails
                }
            }
        }

    });
}

function showError(name, message) {
    notify("center", "error", `Invalid ${name}`,
        `${message}`, true, 50000);
    $("#modal-edit-user").modal("hide");
}

function checkMail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


function validateMalawianPhoneNumber(phoneNumber) {
    var phoneRegex = /^(\+265|0)[1-9]\d{7}$/;
    return phoneRegex.test(phoneNumber);
}

function validatePersonName(name) {
    var nameRegex = /^[A-Za-z\s']+$/;
    return nameRegex.test(name);
}

function validateMoneyAmount(amount) {
    var amountRegex = /^\d+(\.\d{1,2})?$/;
    return amountRegex.test(amount);
}


function validateDateOfBirth(dateString) {
    // Create a regular expression to match the date format "YYYY-MM-DD"


    // Create a Date object from the date string
    var dateOfBirth = new Date(dateString);

    // Get the current date
    var currentDate = new Date();

    // Calculate the age difference in milliseconds
    var ageDifference = currentDate - dateOfBirth;

    // Convert the age difference to years
    var age = Math.floor(ageDifference / (1000 * 60 * 60 * 24 * 365.25));

    // Check if the age is less than 18
    if (age < 18) {
        console.log(age);
        return false; // Age is less than 18
    }

    return true; // Valid date of birth
}


function validateTraditionalAuthority(traditionalAuthority) {
    var regex = /^[A-Za-z0-9\s-,]+$/;
    var maxLength = 100;

    if (!regex.test(traditionalAuthority)) {
        return false; // Traditional Authority contains invalid characters
    }

    if (traditionalAuthority.length > maxLength) {
        return false; // Traditional Authority exceeds the maximum length
    }

    return true; // Traditional Authority is valid
}


function validateVillage(village) {
    var regex = /^[A-Za-z0-9\s-]{1,100}$/;

    if (!regex.test(village)) {
        return false; // Village name contains invalid characters or exceeds the maximum length
    }

    return true; // Village name is valid
}


function validateAlphanumeric(identifier) {
    var regex = /^[a-zA-Z0-9]+$/;

    if (!regex.test(identifier)) {
        return false; // Identifier contains invalid characters
    }

    return true; // Identifier is valid
}

function validateDescription(description) {
    // Remove leading/trailing whitespace and line breaks
    description = description.trim();

    // Count the number of words in the description
    var wordCount = description.split(/\s+/).length;

    if (wordCount > 300) {
        return false; // Description exceeds the maximum word limit
    }

    return true; // Description is valid
}

function validateStartDate(startDate) {
    // Get the current date
    var today = new Date();

    // Set the time to midnight (00:00:00) to ignore the time component
    today.setHours(0, 0, 0, 0);

    // Compare the start date with today's date
    if (startDate.getTime() > today.getTime()) {
        return false; // Start date is greater than today
    }

    return true; // Start date is valid
}


function validateAlphabeticStringWithSpace(input) {
    var regex = /^[A-Za-z\s]{1,50}$/;

    if (!regex.test(input)) {
        return false; // String does not match the pattern
    }

    return true; // String is valid
}

function validateFutureDate(input) {
    var inputDate = new Date(input);
    var today = new Date();

    // Set the time to midnight (00:00:00) for both dates
    inputDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (inputDate > today && inputDate.getTime() !== today.getTime()) {
        return true; // Date is in the future but not today
    }

    return false; // Date is in the past or today
}

