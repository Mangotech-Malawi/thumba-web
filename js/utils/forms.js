

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


function validateBackDate(input) {
  // Convert input to Date object
  var inputDate = new Date(input);

  // Get today's date
  var today = new Date();

  if (inputDate > today) {
    return false; // Date is greater than today
  }

  return true; // Date is less than or equal to today
}
  

function  getButton(dataFields, modal, color, icon) {
    return `<button type='button' class="btn btn-${color}" data-toggle="modal" 
            data-target="#modal-${modal}" ${dataFields} ><i class="${icon}" aria-hidden="true"></i></button>`;
}