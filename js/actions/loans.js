import * as loans from "../services/loans.js";
import { notify } from "../services/utils.js";
import { loadContent } from "./contentLoader.js";
import * as interest from "../services/interests.js";

const applicationModal = "#modal-loan-application";

$(function () {


  $(document).on("show.bs.modal", applicationModal, function (e) {
    let interests = interest.fetchInterests();
    let opener = e.relatedTarget;
    let actionType = $(opener).attr("data-action-type");
    let interestsArray = []
    
    interests.forEach(function (interest, index){
        interestsArray.push(
          '<option value ="',
          interest.id,
          '">',
          `${interest.name} | ${ interest.rate}%`,
          "</option>"
        );
      
    });

    $("#interestsRates").html(interestsArray.join(""));

   
  

    if (actionType === "add") {
      $("#appTitle").text("Add Loan application");
    } else if (actionType === "edit") {
      $("#appTitle").text("Edit Loan Application");
      $.each(opener.dataset, function (key, value) {
        $(applicationModal).find(`[id = '${key}']`).val(value);
      });
    }


  });

  $(document).on("click", "#statusNew", function (e) {
    $.when(loadApplicationStatusView("views/loans/new.html")).done(
      function () {
        loans.fetchLoanApplications();
      } 
    );
  });

  $(document).on("click", "#statusFirstApproved", function (e) {
    $.when(loadApplicationStatusView("views/loans/firstApproval.html")).done(
      function () {
        
      } 
    );
  });
  

  $(document).on("click", "#saveApplicationBtn", function (e){
    if($(this).text() === "Next"){
      $("#firstApplicationRow").addClass("d-none");
      $("#secApplicationRow").removeClass("d-none");
      $(this).text("Finish");
    }
  });

});

function loadApplicationStatusView(path) {
  $.when(loadContent("mainContent", "", path)).done(function () {});
}

//FORMS AND CLIENT RECORDS RECORDS METHODS
function loadForm(id, path) {
  $.when(loadContent(id, "", path)).done(function () {});
}

function loadInterestRates(){

}
