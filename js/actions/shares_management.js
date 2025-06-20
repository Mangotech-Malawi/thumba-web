import * as share_management from "../services/share_management.js";
import * as loadContent from "../actions/contentLoader.js";
import { loadIdentifierTypes } from "../services/users.js";

$(function () {
    $(document).on("click", "#btnShareholderBtn", function () {
        console.log("Client something");
        $.when(loadContent.loadIndividualRecordView("views/forms/shareholder.html", "shareholder_form")).done(
            function () {
                loadIdentifierTypes();
            }
        );
    });
})