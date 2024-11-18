import * as client from "../services/clients.js";
import * as form from "../utils/forms.js";
import * as contentLoader from "../actions/contentLoader.js";
import * as investment from "../services/investments.js";

let currentDataset = null;
localStorage;

$(function () {


    $(document).on("click", "#btnInvestments", function (e) {
        clientInvestmentsView();
    });

    $(document).on("click", "#addSub", function (e) {
        $.when(contentLoader.loadIndividualRecordView("views/forms/investment.html", "add_investment")).done(
            function () {
                let investmentPackagesArray = [];
                let investmentPackages = investment.fetchInvestimentPackages("load-none");

                if (investmentPackages !== null) {
                    investmentPackages.forEach(function (investment_package, index) {
                        investmentPackagesArray.push(
                            '<option value ="',
                            investment_package.id,
                            '">',
                            `${investment_package.package_name} | ${investment_package.interest_rate}%`,
                            "</option>"
                        )
                    });

                    $("#investmentPackageId").html(investmentPackagesArray.join(""));
                }
            }
        );
    });
});

function clientInvestmentsView() {

    if (localStorage.getItem("clientDataSet") != null) {
        currentDataset = JSON.parse(localStorage.getItem("clientDataSet"));

        $.when(contentLoader.loadIndividualRecordView("views/clients/investments.html", "client_investments")).done(
            function () {
                $("#recordName").text(
                    `${currentDataset.recordFirstname} ${currentDataset.recordLastname} Assets`
                );

                client.fetchClientInvesments({
                    client_id: currentDataset.recordId,
                });
            }
        );
    }

}