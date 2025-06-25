import * as share_management from "../services/share_management.js";
import * as form from "../utils/forms.js";
import * as loadContent from "../actions/contentLoader.js";
import { loadIdentifierTypes } from "../services/users.js";

const capitalContributionModal = "#modal-capital-contribution";
let capitalContributionModalTitle = "#capitalContributionModalTitle";
const capitalContributionStatusModal = "#modal-capital-contibuton-status";

$(function () {
    $(document).on("click", "#btnShareholderBtn", function () {
        console.log("Client something");
        $.when(loadContent.loadIndividualRecordView("views/forms/shareholder.html", "shareholder_form")).done(
            function () {
                loadIdentifierTypes();
            }
        );
    });

    $(document).on("click", "#saveShareholderBtn", function () {
        if (form.validClientFormData()) {
            if ($("#cardTitle").text().trim() === "Add Shareholder") {
                notification(
                    share_management.addShareholder(shareholderParams()).created,
                    "center",
                    "success",
                    "registration",
                    "Add Shareholder",
                    "Shareholder has been added successfully",
                    true,
                    3000
                );
            } else if ($("#cardTitle").text().trim() === "Edit Shareholder") {
                notification(
                    share_management.updateShareholder(shareholderParams()).uppdated,
                    "center",
                    "success",
                    "registration",
                    "Edit Shareholder",
                    "Shareholder has been updated successfully",
                    true,
                    3000
                );
            }
        }
    });

    $(document).on("show.bs.modal", capitalContributionModal, function (e) {
        const opener = e.relatedTarget;

        $(capitalContributionModal).find(`[id= 'shareholderId']`)
            .val($(opener).attr("data-shareholder-id"));

        if ($(opener).attr("data-action-type") === "edit") {
            $(capitalContributionModalTitle).text("Edit Capital Contribution");
        } else {
            $(capitalContributionModalTitle).text("Add Capital Contribution");
        }

        populateShareClasses(share_management.fetchShareClasses());
    });

    $(document).on("click", "#saveCapitalContributionBtn", function () {
        if (form.validCapitalContributionFormData()) {
            if ($(capitalContributionModalTitle).text().trim() === "Add Capital Contribution") {
                notification(
                    share_management.addCapitalContribution(capitalContributionParams()).created,
                    "center",
                    "success",
                    "capital_contribution",
                    "Add Capital Contribution",
                    "Capital Contribution has been added successfully",
                    true,
                    3000
                );
            } else if ($(capitalContributionModalTitle).text().trim() === "Edit Capital Contribution") {
                notification(
                    share_management.editCapitalContribution(capitalContributionParams()).created,
                    "center",
                    "success",
                    "capital_contribution",
                    "Edit Capital Contribution",
                    "Capital Contribution has been updated successfully",
                    true,
                    3000
                );
            }
        }
    });

    // Place this in your main JS file or after DataTable initialization

    $(document).on('change', '.capital-status-selector', function () {
        const id = $(this).data('id');
        const newStatus = $(this).val();
        const $select = $(this);

        $.when($(capitalContributionStatusModal).modal("show")).done(function () {
            $("#confirmationMessage").text(`Are you sure you want to update
                                         capital contribution to ${newStatus}`);

            $(capitalContributionStatusModal).find(`[id= 'contributionId']`).val(id);
            $(capitalContributionStatusModal).find(`[id= 'contributionStatus']`).val(newStatus);
        });

    });

    $(document).on('click', '#updateCapitalContributionStatusBtn', function () {
        const id = $(capitalContributionStatusModal).find(`[id= 'contributionId']`).val();
        const newStatus = $("#contributionStatus").val();
        
        notification(
            share_management.updateCapitalContributionStatus({ id: id, status: newStatus }).updated,
            "center",
            "success",
            "capital_contribution_status",
            "Capital Contribution Status Update",
            `Capital Contribution has been ${newStatus} successfully`,
            true,
            3000
        );
    });
})

// Shareholder params
function shareholderParams() {
    let shareholder_id = $("#shareholderId").val();
    let identifier = $("#identifier").val();
    let identifierTypeId = $("#identifierType").val();
    let firstname = $("#firstname").val();
    let lastname = $("#lastname").val();
    const email_address = $("#emailAddress").val();
    const phone_number = $("#phoneNumber").val();
    let gender = $("#gender option:selected").val();
    let date_of_birth = $("#dateOfBirth").val();
    let home_district = $("#homeDistrict option:selected").val();
    let home_ta = $("#homeTa").val();
    let home_village = $("#homeVillage").val();
    let current_district = $("#currentDistrict option:selected").val();
    let current_ta = $("#currentTa").val();
    let current_village = $("#currentVillage").val();

    let params = {
        shareholder_id: shareholder_id,
        identifier: identifier,
        identifier_type_id: identifierTypeId,
        firstname: firstname,
        lastname: lastname,
        email_address: email_address,
        phone_number: phone_number,
        gender: gender,
        date_of_birth: date_of_birth,
        home_district: home_district,
        home_ta: home_ta,
        home_village: home_village,
        current_district: current_district,
        current_ta: current_ta,
        current_village: current_village,
    };

    return params;
}

// Capital contribution params
function capitalContributionParams() {
    const shareholder_id = $("#shareholderId").val()
    const share_class_id = $("#shareClassSelector").val();
    const amount = $("#amount").val();
    const contributed_date = $("#contributedDate").val();

    const params = {
        shareholder_id: shareholder_id,
        share_class_id: share_class_id,
        amount: amount,
        contributed_date: contributed_date
    }

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
                case "registration":
                    $.when(loadContent.loadRecord("views/share_management/shareholders.html", "shareholders")).done(function () {
                        share_management.fetchShareholders();
                    });
                    break;
                case "capital_contribution":
                    $.when(loadContent.loadRecord("views/share_management/capital_contributions.html", "capital_contribution")).done(function () {
                        share_management.fetchCapitalContributions();
                        $(capitalContributionModal).modal("hide");
                    });
                    break;
                case "capital_contribution_status":
                    share_management.fetchCapitalContributions();
                    $(capitalContributionStatusModal).modal("hide");
                    break;

            }
        });
}


function populateShareClasses(shareClasses) {

    let shareClassArray = [];

    shareClasses.forEach(function (share_class, index) {
        shareClassArray.push(
            '<option value ="',
            share_class.id,
            '">',
            `${share_class.code} | ${share_class.name}`,
            "</option>"
        );
    });

    $("#shareClassSelector").html(shareClassArray.join(""));
}
