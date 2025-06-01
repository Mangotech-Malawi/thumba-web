import * as loans from "../services/loans.js";
import * as contentLoader from "../actions/contentLoader.js";

let currentDisbursementDataset;
let loan_id;
localStorage;
let currentDataset = null;

$(function () {

    $(document).on("click", ".loan-disbursement", function (e) {
        currentDisbursementDataset = this.dataset;
        localStorage.setItem("loanDisbursement",
          JSON.stringify(currentDisbursementDataset));
    
        loan_id = $(this).data().loanId;
        let headerText = `Loan Disbursement for ${$(this).data().applicant}`;
    
        $.when(contentLoader.loadIndividualRecordView("views/loans/loan_disbursement.html", "loan_disbursement")).done(
          function () {
            $("#disbursementLoanId").val(loan_id);
            $("#disbursementTitle").text(headerText);
            
            $.when(loans.fetchLoanDisbursements({ loan_id: loan_id })).done(function () { });
          });
    
      });
})