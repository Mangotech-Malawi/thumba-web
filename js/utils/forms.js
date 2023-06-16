

function checkMail(email){
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

function validateMoneyAmount(amount) {
    var amountRegex = /^\d+(\.\d{1,2})?$/;
    return amountRegex.test(amount);
}

function validateDateOfBirth(dateString) {
    // Create a regular expression to match the date format "YYYY-MM-DD"
    var regex = /^\d{4}-\d{2}-\d{2}$/;
  
    // Check if the date string matches the required format
    if (!regex.test(dateString)) {
      return false; // Invalid date format
    }
  
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
      return false; // Age is less than 18
    }
  
    return true; // Valid date of birth
}

function validateVillage(village) {
    var regex = /^[A-Za-z0-9\s-]{1,100}$/;
  
    if (!regex.test(village)) {
      return false; // Village name contains invalid characters or exceeds the maximum length
    }
  
    return true; // Village name is valid
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

function  getButton(dataFields, modal, color, icon) {
    return `<button type='button' class="btn btn-${color}" data-toggle="modal" 
            data-target="#modal-${modal}" ${dataFields} ><i class="${icon}" aria-hidden="true"></i></button>`;
}