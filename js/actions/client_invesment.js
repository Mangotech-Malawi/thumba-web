import * as client from "../services/clients.js";
import * as form from "../utils/forms.js";
import * as contentLoader from "../actions/contentLoader.js";
import * as investment from "../services/investments.js";

let currentDataset = null;
localStorage;

$(function () {


    $(document).on("click", "#btnInvestments", function (e) {
        clientInvestmentsSubView();
    });

    $(document).on("click", "#addSub", function (e) {
        $.when(contentLoader.loadIndividualRecordView("views/forms/investment.html", "add_investment")).done(
            function () {
                let investmentPackagesArray = [];
                let investmentPackages = investment.fetchInvestimentPackages("load-none");


                if (investmentPackages !== null) {
                    let investmentPackagesArray = [];
                    investmentPackages.forEach(function (investment_package) {
                        investmentPackagesArray.push(
                            '<option value="',
                            encodeURIComponent(JSON.stringify(investment_package)),
                            '">',
                            `${investment_package.package_name} | ${investment_package.interest_rate}%`,
                            '</option>'
                        );
                    });

                    $("#investmentPackageId").html(investmentPackagesArray.join(""));
                }

            }
        );
    });

    $(document).on("change", "#investmentPackageId", function () {
        const selectedPackage = $(this).val();
        if (selectedPackage) {
            const investmentPackageObject = JSON.parse(decodeURIComponent(selectedPackage));

            // Update the labels
            $("#minAmount").text(investmentPackageObject.min_amount);
            $("#maxAmount").text(investmentPackageObject.max_amount);
            $("#interestRate").text(`${investmentPackageObject.interest_rate}%`);
            $("#interestFrequency").text(investmentPackageObject.interest_frequency);
            $("#duration").text(`${investmentPackageObject.duration} ${investmentPackageObject.duration_type}`);
            $("#currency").text(investmentPackageObject.currency);
            $("#compoundingFrequency").text(investmentPackageObject.compounding_frequency);

            // Show the details section if hidden
            $("#investmentPackageDetails").show();
        } else {
            // Hide the details section if no package is selected
            $("#investmentPackageDetails").hide();
        }
    });



    $(document).on("click", "#investmentSubBtn", function (e) {
        if (form.validateInvestmentForm()) {
            if ($("#formTitle").text().trim() === "Add Investment Subscription") {
                notification(
                    investment.addInvestment(getInvestmentParams()).created,
                    "center",
                    "success",
                    "investment",
                    "Add Investment",
                    "Investment has been added successfully",
                    true,
                    3000
                );
            } else if ($("#formTitle").text() === "Edit Investment Subscription") {
                notification(
                    investment.editInvestment(getInvestmentParams()).updated,
                    "center",
                    "success",
                    "investment",
                    "Edit Investment",
                    "Investment has been edited successfully",
                    true,
                    3000
                );
            }
        }
    });

    $(document).on("click", ".client-investments", function (e) {
        const subscription_id = $(this).data().subscriptionId;
        
        clientInvestmentsView(subscription_id);
    });

});

function getInvestmentParams() {

    let investment_id = $("#investmentId").val();

    let investment_package_id = JSON.parse(decodeURIComponent($("#investmentPackageId").val())).id
    let amount = $("#amount").val();
    let description = $("#description").val();
    let investment_date = $("#investmentDate").val();

    let params = {
        id: investment_id,
        client_id: currentDataset.recordId,
        investiment_package_id: investment_package_id,
        amount: amount,
        description: description,
        investment_date: investment_date
    }

    return params;
}

function clientInvestmentsSubView() {

    if (localStorage.getItem("clientDataSet") != null) {
        currentDataset = JSON.parse(localStorage.getItem("clientDataSet"));

        $.when(contentLoader.loadIndividualRecordView("views/clients/investmentsSubscription.html", "client_investments")).done(
            function () {
                $("#recordName").text(
                    `${currentDataset.recordFirstname} ${currentDataset.recordLastname} Assets`
                );

                investment.fetchClientSubscriptions({
                    client_id: currentDataset.recordId,
                });

            }
        );
    }
}

function clientInvestmentsView(subscription_id){
    if (localStorage.getItem("clientDataSet") != null) {
        currentDataset = JSON.parse(localStorage.getItem("clientDataSet"));

        $.when(contentLoader.loadIndividualRecordView("views/clients/investments.html", "investments")).done(
            function () {
                $("#recordName").text(
                    `${currentDataset.recordFirstname} ${currentDataset.recordLastname} Assets`
                );

               investment.fetchMyInvestments({
                    subscription_id: subscription_id,
                });

            }
        );
    }
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
                case "investment":
                    clientInvestmentsSubView();
                    break;
            }
        });
}

