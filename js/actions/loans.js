import * as loans from "../services/loans.js";
import { notify } from "../services/utils.js";
import { loadContent } from "./contentLoader.js";
import * as interest from "../services/interests.js";
import * as client from "../services/clients.js";

const applicationModal = "#modal-loan-application";
const guarantorModal = "#modal-guarantors";
const approveModal = "#modal-approve";
const loanPaymentModal = "#modal-loan-payments";
const collateralSeizureModal = "#modal-seized-collateral";
const sellCollateralModal = "#modal-sell-collateral";

let loanApplicationId;
let selectedLoanPaymentId = null;
let paymentDate;
let loan_id;
let localStorage;
let currentLoanPaymentDataset;

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
      $("#loanApplicationTitle").text("Add Loan Application");
    } else if (actionType === "edit") {
      $("#loanApplicationTitle").text("Edit Loan Application");
      let collaterals = JSON.parse($(opener).attr("data-collaterals"));

      $.when(
        client.getClientById(
          JSON.parse($(opener).attr("data-loan-app-client-id"))
        )
      ).done(function (client) {
        populateCollaterals(client.assets)
      });

      let collateralIds = new Array();
      collaterals.forEach(function (collateral, index) {
        collateralIds.push(collateral.asset_id);
      });

      $("#corraterals").val(collateralIds);
      $('#corraterals').trigger('change');

      $.each(opener.dataset, function (key, value) {
        $(applicationModal).find(`[id = '${key}']`).val(value);
        $(applicationModal).find(`[id = '${key}']`).text(value);
      });
    }
  });


  $(document).on("hide.bs.modal", applicationModal, function (e) {
    clearFields("#loanApplicationForm")
    $("#applicantFirstname").text("");
    $("#applicantLastname").text("");
    $("#applicantGender").text("");
  });

  $(document).on("click", "#searchClientBtn", function (e) {
    let identifier = $("#loanAppClientId").val();
    if (identifier != null && identifier != "")
      $.when(client.getClientById(identifier)).done(function (client) {
        if (client != null && typeof client != undefined) {
          populateCollaterals(client.assets);
          $("#applicantFirstname").text(client.demographics[0].firstname);
          $("#applicantLastname").text(client.demographics[0].lastname);
          $("#applicantGender").text(client.demographics[0].gender);
        } else {
          $("#applicantFirstname").text("");
          $("#applicantLastname").text("");
          $("#applicantGender").text("");
        }
      });
  });

  $(document).on("click", "#statusNew", function (e) {
    $.when(loadApplicationStatusView("views/loans/new.html", "new_applications")).done(function () {
      loans.fetchLoanApplications({ status_name: "NEW" });
    });
  });

  $(document).on("click", "#statusWaiting", function (e) {
    $.when(loadApplicationStatusView("views/loans/waiting.html", "waiting_applications")).done(
      function () {
        loans.fetchLoanApplications({ status_name: "WAITING" });
      });
  });

  $(document).on("click", "#statusCompleted", function (e) {
    $.when(loadApplicationStatusView("views/loans/done.html", "completed_applications")).done(
      function () {
        loans.fetchLoanApplications({ status_name: "DONE" });
      });
  });

  $(document).on("click", "#statusDumped", function (e) {
    $.when(loadApplicationStatusView("views/loans/dumped.html"), "dumped_applications").done(
      function () {
        loans.fetchLoanApplications({ status_name: "DUMPED" });
      });
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

  $(document).on("click", "#saveGuarantorBtn", function (e) {
    notification(
      loans.addGuarantor(loadLoanGuarantorParams()).created,
      "center",
      "success",
      "guarantor",
      "Add Loan Guarantor",
      "Loan guarantor has been added successfully",
      true,
      3000
    );
  });

  $(document).on("show.bs.modal", guarantorModal, function (e) {

    let opener = e.relatedTarget;
    $("#guarantorModalTitle").text(
      `${$(opener).attr("data-firstname")} ${$(opener).attr(
        "data-lastname"
      )} Guarantors`
    );
    loanApplicationId = $(opener).attr("data-loan-application-id");
  });

  $(document).on("hide.bs.modal", guarantorModal, function (e) {
    let someTabTriggerEl = document.querySelector(
      "#custom-content-above-home-tab"
    );
    let tab = new bootstrap.Tab(someTabTriggerEl);
    tab.show();
  });

  $(document).on("shown.bs.tab", "#custom-content-above-tab", function (e) {

    if (e.target.id === "custom-content-above-profile-tab") {
      loans.fetchLoanGuarantors({ loan_application_id: loanApplicationId });
    } else if (e.target.id === "custom-content-above-home-tab") {
    }
  });

  $(document).on("show.bs.modal", approveModal, function (e) {
    let opener = e.relatedTarget;
    loanApplicationId = $(opener).attr("data-loan-application-id");
    let firstname = $(opener).attr("data-firstname");
    let lastname = $(opener).attr("data-lastname");
    let gender = $(opener).attr("data-gender");
    let amount = $(opener).attr("data-amount");
    let rate = $(opener).attr("data-rate");
    let purpose = $(opener).attr("data-purpose");
    paymentDate = addWeeks(new Date(), parseInt($(opener).attr("data-period")));
    let collaterals = JSON.parse($(opener).attr("data-collaterals"));
    let riskPercentage = $(opener).attr("data-risk-percentage");
    let gradeName = $(opener).attr("data-grade-name");
    let gradeRange = $(opener).attr("data-grade-range");
    let scores = $(opener).attr("data-scores");
    let interest = (parseFloat(rate) * parseFloat(amount)) / 100
    let repaymentAmount = interest + parseFloat(amount)

    $("#approveLoanAppId").val(loanApplicationId);
    $("#approve-fullname").text(`${firstname} ${lastname}`);
    $("#approve-gender").text(gender);
    $("#approve-amount").text(amount);
    $("#approve-rate").text(rate);
    $("#approve-interest").text(interest);
    $("#approve-repayment-amount").text(repaymentAmount);
    $("#approve-payment-date").text(paymentDate);
    $("#approve-purpose").text(purpose);
    $("#grade-name").text(gradeName);
    $("#score-grade-range").text(gradeRange);
    $("#score-percentage").text(riskPercentage);

    populateCollateralsRow(collaterals);
  });

  $(document).on("click", "#approveLoanBtn", function (e) {
    notification(
      loans.addLoan({
        loan_application_id: loanApplicationId,
        due_date: paymentDate
      }).created,
      "center",
      "success",
      "approve",
      "Appprov Loan Application",
      "Loan application has been approved successfully",
      true,
      3000
    );
  });

  $(document).on("click", ".loan-payments", function (e) {
    currentLoanPaymentDataset = this.dataset;
    localStorage.setItem("loanPaymentDataset", 
                          JSON.stringify(currentLoanPaymentDataset));

    loan_id = $(this).data().loanId;
    let headerText = `Loan Payments for ${$(this).data().firstname} ${$(this).data().lastname}`;
    
    $.when(loadRecord("views/loans/loan_payments.html", "loan_payments")).done(
      function () {
        $("#paymentLoanId").val(loan_id);
        $("#paymentTitle").text(headerText);

        $.when(loans.fetchLoanPayments({loan_id: loan_id})).done(function () {});
    });


  });

  $(document).on("click", "#saveLoanPaymentBtn", function (e) {
    let amount = $("#amount").val();
    let paymentDate = $("#paymentDate").val();
    let loanId = $("#paymentLoanId").val();

    if (selectedLoanPaymentId != null) {
      notification(
        loans.updateLoanPayment({
          loan_id: loanId,
          loan_payment_id: selectedLoanPaymentId,
          paid_amount: amount,
          payment_date: paymentDate
        }).created,
        "center",
        "success",
        "loan-payment",
        "Edit Loan Payment",
        "Loan payment has updated been updated successfully",
        true,
        3000
      );
    } else {
      notification(
        loans.addLoanPayment({
          loan_id: loanId,
          paid_amount: amount,
          payment_date: paymentDate
        }).created,
        "center",
        "success",
        "loan-payment",
        "Add Loan Payment",
        "Loan payment has been done successfully",
        true,
        3000
      );
    }
  });

  $(document).on("click", ".edit-loan-payment", function (e) {
    let table = $("#loanPaymentsTable").DataTable();
    let data = table.row($(this).parents('tr')).data();
    selectedLoanPaymentId = data.id

    $("#amount").val(data.paid_amount);
    $("#paymentDate").val(data.payment_date);

  });

  $(document).on("click", ".delete-loan-payment", function (e) {
    let table = $("#loanPaymentsTable").DataTable();
    let data = table.row($(this).parents('tr')).data();
    selectedLoanPaymentId = data.id

    notification(
      loans.deletePayment({
        loan_payment_id: selectedLoanPaymentId,
      }).deleted,
      "center",
      "success",
      "loan-payment",
      "Delete Loan Payment",
      "Loan payment has been deleted successfully",
      true,
      3000
    );
  });

  $(document).on("show.bs.modal", collateralSeizureModal, function (e) {
    let opener = e.relatedTarget;
    let collaterals = JSON.parse($(opener).attr("data-collaterals"));

    populateCollaterals(collaterals);

  });

  $(document).on("click", "#seizeCollateralBtn", function (e) {
    let collaterals = $("#corraterals").val();
    let collateralsArray = new Array();

    collaterals.forEach(function (collateral, index) {
      collateralsArray.push(collateral);
    });

    notification(
      loans.addCollateralSeizure({
        collateral_ids: collateralsArray,
      }).created,
      "center",
      "success",
      "collateral-seizure",
      "Add Loan Collateral Seizure",
      "Collateral Seizure has been added successfully",
      true,
      3000
    );
  });

  $(document).on("show.bs.modal", sellCollateralModal, function (e) {
    let opener = e.relatedTarget;
    $.each(opener.dataset, function (key, value) {
      $(sellCollateralModal).find(`[id = '${key}']`).text(value);
      $(sellCollateralModal).find(`[id = '${key}']`).val(value);
    });
  });

  $(document).on("click", ".return-collateral", function (e) {
    let seizure_id = $(this).data().id;

    notification(
      loans.removeCollateralSeizure({
        seizure_id: seizure_id,
      }).unseized,
      "center",
      "success",
      "remove-seizure",
      "Remove Collateral Seizure",
      "Collateral Seizure has been removed successfully",
      true,
      3000
    );
  });

  $(document).on("click", "#sellCollateralBtn", function (e) {

    let soldPrice = $("#sellingPrice").val();
    let soldDate = $("#soldDate").val();

    if ($("#collateralSaleModalTitle").text() === "Add Collateral Sale") {
      let seizureId = $("#seizureId").val();

      notification(
        loans.sellCollateral({
          collateral_seizure_id: seizureId,
          sold_price: soldPrice,
          sold_date: soldDate
        }).created,
        "center",
        "success",
        "sell-collateral",
        "Sell Collateral",
        "Collateral sale has been recorded successfully",
        true,
        3000
      );
    } else {
      let collateralSaleId = $("#collateralSaleId").val();

      notification(
        loans.editCollateralSale({
          collateral_sale_id: collateralSaleId,
          sold_price: soldPrice,
          sold_date: soldDate
        }).updated,
        "center",
        "success",
        "collateral-sale",
        "Edit Collateral Sale",
        "Collateral sale has been updated successfully",
        true,
        3000
      );
    }

  });


  $(document).on("click", ".delete-collateral-sale", function (e) {
    let collateralSaleId = $(this).data().id;

    notification(
      loans.deleteCollateralSale({
        collateral_sale_id: collateralSaleId
      }).deleted,
      "center",
      "success",
      "collateral-sale",
      "Delete Collateral Sale",
      "Collateral sale has been deleted successfully",
      true,
      3000
    );
  });

});

function populateCollaterals(collaterals) {
  let collateralArray = [];
  collaterals.forEach(function (collateral, index) {
    collateralArray.push(
      '<option value ="',
      collateral.id,
      '">',
      `${collateral.name} | Market Value: MK${collateral.market_value}`,
      "</option>"
    );
  });

  $("#corraterals").html("");
  $("#corraterals").html(collateralArray.join(""));
}

function loanApplicationParams() {
  let id = $("#id").val();
  let client_id = $("#loanAppClientId").val();
  let amount = $("#amount").val();
  let interestId = $("#interestsRates option:selected").val();
  let purpose = $("#purpose").val();
  let collaterals = $("#corraterals").val();
  let collateralsArray = new Array();

  collaterals.forEach(function (collateral, index) {
    collateralsArray.push(collateral);
  });

  let params = {
    loan_application_id: id,
    client_id: client_id,
    amount: amount,
    interest_id: interestId,
    purpose: purpose,
    collaterals: collateralsArray,
  };

  return params;
}

function loadLoanGuarantorParams() {
  let national_id = $("#nationalId").val();
  let firstname = $("#firstname").val();
  let lastname = $("#lastname").val();
  let gender = $("#gender option:selected").val();
  let date_of_birth = $("#dateOfBirth").val();
  let home_district = $("#homeDistrict option:selected").val();
  let home_ta = $("#homeTa").val();
  let home_village = $("#homeVillage").val();
  let current_district = $("#currentDistrict option:selected").val();
  let current_ta = $("#currentTa").val();
  let current_village = $("#currentVillage").val();
  let nearest_landmark = $("#nearest_landmark option:selected").val();
  let relationship = $("#relationship option:selected").val();

  let params = {
    loan_application_id: loanApplicationId,
    national_id: national_id,
    firstname: firstname,
    lastname: lastname,
    gender: gender,
    date_of_birth: date_of_birth,
    home_district: home_district,
    home_ta: home_ta,
    home_village: home_village,
    current_district: current_district,
    current_ta: current_ta,
    current_village: current_village,
    nearest_landmark: nearest_landmark,
    relationship: relationship,
  };

  return params;
}

function loadApplicationStatusView(path, state) {
  $.when(loadContent("mainContent", state, path)).done(function () { });
}

function loadRecord(path, state) {
  $.when(loadContent("mainContent", state, path)).done(function () { });
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
          $.when(loans.fetchLoanApplications({ status_name: "NEW" })).done(function () {
            $(applicationModal).modal("hide");
          });
          break;
        case "guarantor":
          $.when(loans.fetchLoanGuarantors()).done(function () { });
          break;
        case "approve":
          $.when(loans.fetchLoanApplications({ status_name: "WAITING" })).done(function () {
            $(approveModal).modal("hide");
          });
          break;
        case "loan-payment":
          $(loans.fetchLoanPayments({ loan_id: loan_id })).done( function () {
            selectedLoanPaymentId = null;
          });
          break;
        case "collateral-seizure":
          $(collateralSeizureModal).modal("hide");
          break;
        case "remove-seizure":
          loans.fetchCollateralSeizures();
          break;
        case "sell-collateral":
          $.when(loans.fetchCollateralSeizures()).done(function () {
            $(sellCollateralModal).modal("hide");
          });
          break;
        case "collateral-sale":
          $.when(loans.fetchCollateralSales()).done(function () {
            $(sellCollateralModal).modal("hide");
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
    .prop("selected", false)
    .text("");
}

function populateCollateralsRow(collaterals) {
  $("#approve-collaterals").html("");
  collaterals.forEach(function (collateral, index) {
    $("#approve-collaterals").append(`
    <div class="col-sm-4 border-right">                   
      <div class="description-block">
        <h5  class="description-header">${collateral.name}</h5>
        <span class="description-text">(${index + 1}) COLLATERAL NAME</span>
      </div>
      <!-- /.description-block -->
    </div>

    <div class="col-sm-4 border-right">                   
      <div class="description-block">
        <h5  class="description-header">${collateral.purchase_price}</h5>
        <span class="description-text">(${index + 1}) PURCHASE PRICE</span>
      </div>
      <!-- /.description-block -->
    </div>

    <div class="col-sm-4 border-right">                   
    <div class="description-block">
      <h5  class="description-header">${collateral.market_value}</h5>
      <span class="description-text">(${index + 1}) MARKET VALUE</span>
    </div>
    <!-- /.description-block -->
    </div>

   `);

  });
}

function addWeeks(date, weeks) {
  date.setDate(date.getDate() + 7 * weeks);
  let options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}
