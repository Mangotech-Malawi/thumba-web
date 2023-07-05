import { validate } from "../utils/validations.js"

let formElements = []

export function validClientFormData(){
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
 
  $.when(validate(formElements)).done( function (value){
       validClientData = value
  });

  return validClientData;
}

function pushFormElements(type, id, isFilled, name){
  formElements.push({
    type: type,
    id: id,
    checkIsFilled: isFilled,
    name: name
  });
}

