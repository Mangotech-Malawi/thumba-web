import * as loans from "../services/loans.js";
import { notify } from "../services/utils.js";
import { loadContent } from "./contentLoader.js";
import * as interest from "../services/interests.js";
import * as client from "../services/clients.js";

const applicationModal = "#modal-loan-application";
const guarantorModal = "#modal-guarantors";
let loanApplicationId;

$(function () {
  $(document).on("show.bs.modal", applicationModal, function (e) {
    let interests = interest.fetchInterests();
    let opener = e.relatedTarget;
    let actionType = $(opener).attr("data-action-type");
    let interestsArray = [];

    interests.forEach(function (interest, index) {
      interestsArray.push(
        '<option value ="',
        interest.id,
        '">',
        `${interest.name} | ${interest.rate}%`,
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

  $(document).on("click", "#searchClientBtn", function (e) {
    let identifier = $("#loanAppClientId").val();
    if (identifier != null && identifier != "")
      $.when(client.getClientById(identifier)).done(function (client) {
        let assetsArray = [];
        if (client != null && typeof client != undefined) {
          client.assets.forEach(function (asset, index) {
            assetsArray.push(
              '<option value ="',
              asset.id,
              '">',
              `${asset.name} | Market Value: MK${asset.market_value}`,
              "</option>"
            );
          });

          $("#corraterals").html(assetsArray.join(""));

          $("#applicantFirstname").text(client.demographics[0].firstname);
          $("#applicantLastname").text(client.demographics[0].lastname);
          $("#applicantGender").text(client.demographics[0].gender);
        } else {
          $("#corraterals").html("");
          $("#applicantFirstname").text("");
          $("#applicantLastname").text("");
          $("#applicantGender").text("");
        }
      });
  });

  $(document).on("click", "#statusNew", function (e) {
    $.when(loadApplicationStatusView("views/loans/new.html")).done(function () {
      loans.fetchLoanApplications();
    });
  });

  $(document).on("click", "#statusFirstApproved", function (e) {
    $.when(loadApplicationStatusView("views/loans/firstApproval.html")).done(
      function () {}
    );
  });

  $(document).on("click", "#saveApplicationBtn", function (e) {
    if ($("#loanApplicationTitle").text() === "Add Loan Application") {
      notification(
        loans.addApplication(loanApplicationParams()).created,
        "center",
        "success",
        "application",
        "Add Client Loan Application",
        "Client application loan has been added successfully",
        true,
        3000
      );
    } else if ($("#loanApplicationTitle").text() === "Edit Loan Application") {
      notification(
        loans.updateApplication(loanApplicationParams()).updated,
        "center",
        "success",
        "application",
        "Edit Client Loan Application",
        "Client loan has been updated successfully",
        true,
        3000
      );
    }
  });

  $(document).on("show.bs.modal", guarantorModal, function (e) {
    clearFields();
    let opener = e.relatedTarget;
    $("#guarantorModalTitle").text(`${$(opener).attr("data-firstname")} ${$(opener).attr("data-lastname")} Guarantors`);
    loanApplicationId = $(opener).attr("data-loan-application-id");
   
  });

  $(document).on("hide.bs.modal", guarantorModal, function (e) {

      let someTabTriggerEl = document.querySelector('#custom-content-above-home-tab')
      let tab  = new bootstrap.Tab(someTabTriggerEl);
      tab.show();
  });

  $(document).on("shown.bs.tab", "#custom-content-above-tab", function (e) {
    if (e.target.id === "custom-content-above-profile-tab") {
     
      loans.fetchLoanGuarantors({loan_application_id: loanApplicationId});
    } else if (e.target.id === "custom-content-above-home-tab") {
    }
  });
});

function loanApplicationParams() {
  let client_id = $("#loanAppClientId").val();
  let amount = $("#amount").val();
  let interestId = $("#interestsRates option:selected").val();
  let purpose = $("#purpose").val();
  let collaterals = $("#corraterals").val();
  let collateralsArray = [];

  collaterals.forEach(function (collateral, index) {
    collateralsArray.push({ asset_id: collateral });
  });

  let params = {
    client_id: client_id,
    amount: amount,
    interest_id: interestId,
    purpose: purpose,
    collaterals: collateralsArray,
  };

  return params;
}

function loadApplicationStatusView(path) {
  $.when(loadContent("mainContent", "", path)).done(function () {});
}

function notification(
  isDone,
  position,
  icon,
  recordType,
  title,
  text,
  showConfirmButton,
  timer
) {
  if (isDone)
    $.when(
      Swal.fire({
        position: position,
        icon: icon,
        title: title,
        text: text,
        showConfirmButton: showConfirmButton,
        timer: timer,
      })
    ).done(function () {
      switch (recordType) {
        case "application":
          $.when(loans.fetchLoanApplications()).done(function () {
            $(applicationModal).modal("hide");
          });
          break;
      }
    });
}

function clearFields(formId) {
  $(":input", formId)
    .not(":button, :submit, :reset")
    .val("")
    .prop("checked", false)
    .prop("selected", false);
}
