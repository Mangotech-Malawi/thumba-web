import * as loans from "../services/loans.js";
import * as contentLoader from "../actions/contentLoader.js";
import { notify } from "../services/utils.js";
import * as form from "../utils/forms.js";

let currentDisbursementDataset;
let loan_id;
localStorage;
let disbursementFormTitle;
let currentDataset = null;
const disbursementModal = "#modal-disbursement";

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

    $(document).on("show.bs.modal", disbursementModal, function (e) {

    });

    $(document).on("click", "#saveDisbursementBtn", function (e) {

        console.log("Something here strange");
        
        if (form.validateLoanDisbursementForm()) {
            if (disbursementFormTitle === "Add Disbursement") {
                notification(
                    loans.addDisbursement(getDisbursementParams()).created,
                    "center",
                    "success",
                    "disbursement",
                    "Loan Disbursement",
                    "Loan has been disbursed successfully",
                    true,
                    3000
                );
            } else if (disbursementFormTitle === "Edit Disbursement") {
                notification(
                    loans.updateDisbursement(getDisbursementParams()).updated,
                    "center",
                    "success",
                    "disbursement",
                    "Loan Disbursement",
                    "Loan disbursement has been updated successfully",
                    true,
                    3000
                );

            }
        }

    });


})

function getDisbursementParams() {

    const loanId = $("#disbursementLoanId").val();
    const disbursementId = $("#disbursementId").val();
    const amount = $("#disbursedAmount").val();
    const disbursedOn = $("#disbursedDate").val();
    const notes = $("#notes").val();

    params = {
        loan_id: loanId,
        disbursementId: disbursementId,
        disbursed_amount: amount,
        disbursed_on: disbursedOn,
        notes: notes
    }

    return params;
}

