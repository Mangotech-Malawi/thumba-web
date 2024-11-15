import * as client from "../services/clients.js";
import * as form from "../utils/forms.js";
import * as contentLoader from "../actions/contentLoader.js";

let currentDataset = null;
localStorage;

$(function () {

    if (localStorage.getItem("clientDataSet") != null) {
        currentDataset = JSON.parse(localStorage.getItem("clientDataSet"));

        $(document).on("click", "#btnInvestments", function (e) {
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
        });
    }

    $(document).on("click", "#addSub", function (e) {
        $.when(contentLoader.loadIndividualRecordView("views/forms/investment.html", "add_investment")).done(
            function () {
                $("#recordName").text(
                    `${currentDataset.recordFirstname} ${currentDataset.recordLastname} Demographics`
                );
            }
        );
    });
});