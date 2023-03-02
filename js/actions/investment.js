import * as investment from "../services/investments.js";

const investmentModal = "#modal-investment";
$(function () {
    $(document).on("click", "#saveInvestmentPackageBtn", function (e) {
        if ($("#investmentPackageModalTitle").text() === "Add Investment Package") {
            notification(
                investment.addInvestmentPackage(getInvestmentPackageParams()).created,
                "center",
                "success",
                "investment_package",
                "Add Investment Package",
                "Investment Package has been added successfully",
                true,
                3000
            );
        } else if ($("#investmentPackageModalTitle").text() === "Edit Investment Package") {
            notification(
                investment.editInvestmentPackage(getInvestPackageParams()).updated,
                "center",
                "success",
                "investment_package",
                "Edit Investment Package",
                "Investment Package has been edited successfully",
                true,
                3000
            );
        }
    });
});

function getInvestmentPackageParams() {
    let id = $("#investmentPackageId").val();
    let package_name = $("#packageName").val();
    let package_type = $("#packageType option:selected").val();
    let min_amount = $("#minAmount").val();
    let max_amount = $("#maxAmount").val();
    let interest_rate = $("#interestRate").val();
    let interest_rate_frequency = $("#interestRateFrequency option:selected").val();
    let duration = $("#duration").val();
    let currency = $("#currency").val();
    let requirements = $("#requirements").val();
    let terms_and_conditions = $("#termsAndConditions").val();
    let payout_schedule = $("#payoutSchedule").val();
    let risk_level = $("#riskLevel option:selected").val();

    let params = {
                investiment_package_id: id,
                package_name: package_name,
                package_type: package_type,
                min_amount: min_amount,
                max_amount: max_amount,
                interest_rate: interest_rate,
                interest_frequency: interest_rate_frequency,
                duration: duration,
                currency: currency,
                requirements: requirements,
                term_and_conditions: terms_and_conditions,
                payout_schedule: payout_schedule,
                risk_level: risk_level
                }
    console.log(params);
    return params;
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
                case "investment_package":
                    $.when(investment.fetchInvestimentPackages()).done(function () { 
                        $(investmentModal).modal("hide");
                    }); 
                    break;
                case "guarantor":
                    $.when(loans.fetchLoanGuarantors()).done(function () { });
                    break;
            }
        });
}
