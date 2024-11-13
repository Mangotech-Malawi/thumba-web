import * as client from "../services/clients.js";
import * as form from "../utils/forms.js";
import * as contentLoader from "../actions/contentLoader.js";

const businessModal = "#modal-client-business";
let currentDataset = null;
localStorage;

$(function () {

    if (localStorage.getItem("clientDataSet") != null) {
        currentDataset = JSON.parse(localStorage.getItem("clientDataSet"));
    }
    
    $(document).on("click", "#btnBusinesses", function (e) {
        $.when(contentLoader.loadIndividualRecordView("views/clients/businesses.html", "businesses")).done(
            function () {
                $("#recordName").text(
                    `${currentDataset.recordFirstname} ${currentDataset.recordLastname} Businesses`
                );

                client.fetchClientBusinesses({
                    client_id: currentDataset.recordId,
                });
            }
        );
    });

    $(document).on("click", "#saveBusinessBtn", function (e) {
        if (form.validBusinessFormData()) {
            if ($("#regBusTitle").text() === "Add Client Business") {
                notification(
                    client.addBusiness(clientBusinessParams()).created,
                    "center",
                    "success",
                    "business",
                    "Add Client Business",
                    "Client Business has been added successfully",
                    true,
                    3000
                );
            } else if ($("#regBusTitle").text() === "Edit Client Business") {
                notification(
                    client.updateBusiness(clientBusinessParams()).updated,
                    "center",
                    "success",
                    "business",
                    "Edit Client Business",
                    "Client Business has been updated successfully",
                    true,
                    3000
                );
            }
        }
    });

    $(document).on("show.bs.modal", "#modal-del-client-business", function (e) {
        let opener = e.relatedTarget;
        $.each(opener.dataset, function (key, value) {
            $("#modal-del-client-business").find(`[id = '${key}']`).val(value);
        });
    });

    // CLIENT BUSINESS
    $(document).on("show.bs.modal", businessModal, function (e) {
        clearFields("#clientBusiness");

        let opener = e.relatedTarget;
        let actionType = $(opener).attr("data-action-type");

        if (actionType === "add") {
            $("#regBusTitle").text("Add Client Business");
        } else if (actionType === "edit") {
            $("#regBusTitle").text("Edit Client Business");
            $.each(opener.dataset, function (key, value) {
                if (key !== "busRegistered")
                    $(businessModal).find(`[id = '${key}']`).val(value);
                else $(businessModal).find(`[id = '${key}']`).attr("checked", value);
            });
        }
    });

    $(document).on("click", "#delClientBusBtn", function () {
        let id = $("#delClientBusId").val();
        notification(
            client.deleteBusiness({ id: id }).deleted,
            "center",
            "success",
            "business",
            "Delete Client Business",
            "Client business has been deleted successfully",
            true,
            3000
        );

        $("#modal-del-client-business").modal("hide");
    });


});

function clientBusinessParams() {
    let id = $("#clientBusId").val();
    let name = $("#busName").val();
    let industry = $("#busIndustry").val();
    let startDate = $("#busStartDate").val();
    let location = $("#busLocation").val();
    let shortDescription = $("#busShortDesc").val();
    let description = $("#busDescription").val();
    let registered = $("#busRegistered").is(":checked");
  
    let params = {
      id: id,
      client_id: currentDataset.recordId,
      name: name,
      industry: industry,
      start_date: startDate,
      location: location,
      short_description: shortDescription,
      description: description,
      registered: registered,
    };
  
    return params;
  }
  
