import { validate } from "../utils/validations.js"

let formElements = []

export function validClientFormData() {
  formElements = []
  let validClientData = false;
  pushFormElements("nationalId", "#nationalId", true, "National ID");
  pushFormElements("personName", "#firstname", true, "Firstname");
  pushFormElements("personName", "#lastname", true, "Lastname");
  pushFormElements("dateOfBirth", "#dateOfBirth", true, "Date Of Birth");
  pushFormElements("ta", "#homeTa", true, "Home TA");
  pushFormElements("village", "#homeVillage", true, "Home Village");
  pushFormElements("ta", "#currentTa", true, "Current TA");
  pushFormElements("village", "#currentVillage", true, "Current Village");

  $.when(validate(formElements)).done(function (value) {
    validClientData = value
  });

  return validClientData;
}

export function validClientJobFormData() {
  formElements = []
  let validData = false;

  pushFormElements("description", "#title", true, "Job Title");
  pushFormElements("description", "#department", true, "Department");
  pushFormElements("description", "#employerName", true, "Employer Name");
  pushFormElements("startDate", "#dateStarted", true, "Date Started");
  pushFormElements("futureDate", "#contractDue", true, "Contract Due");
  pushFormElements("moneyAmount", "#netSalary", true, "Net Salary");
  pushFormElements("moneyAmount", "#grossSalary", true, "Gross Salary");
  pushFormElements("description", "#postalAddress", true, "Postal Address");
  pushFormElements("email", "#emailAddress", true, "Employer Email Address");
  pushFormElements("phoneNumber", "#phoneNumber", true, "Employer Phone Number");;

  $.when(validate(formElements)).done(function (value) {
    validData = value
  });

  return validData;
}

export function validDependantFormData(){
  formElements = []
  let validData = false;

  
  pushFormElements("alphabeticStringWithSpace", "#dependancy", true, "Dependancy");
  pushFormElements("moneyAmount", "#amount", true, "Amount");


  $.when(validate(formElements)).done( function (value) {
    validData = value;
  });

  return validData;
}

function pushFormElements(type, id, isFilled, name) {
  formElements.push({
    type: type,
    id: id,
    checkIsFilled: isFilled,
    name: name
  });
}

