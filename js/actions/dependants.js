import * as client from "../services/clients.js";
import * as form from "../utils/forms.js";
import * as contentLoader from "../actions/contentLoader.js";

const dependantModal = "#modal-client-dependant";
let currentDataset = null;
localStorage;


$(function () {
    if (localStorage.getItem("clientDataSet") != null) {
        currentDataset = JSON.parse(localStorage.getItem("clientDataSet"));
    }

    $(document).on("click", "#btnDependants", function (e) {
        $.when(contentLoader.loadIndividualRecordView("views/clients/dependants.html", "dependants")).done(
            function () {
                $("#recordName").text(
                    `${currentDataset.recordFirstname} ${currentDataset.recordLastname} Dependants`
                );

                client.fetchClientDependants({
                    client_id: currentDataset.recordId,
                });
            }
        );
    });

    $(document).on("click", "#dependantFormBtn", function (e) {
        $.when(contentLoader.loadIndividualRecordView("views/forms/dependant.html", "dependant_form")).done(
            function () {   
                
            }
        );
    });

    $(document).on("click", "#saveDependantBtn", function (e) {
        if (form.validDependantFormData()) {
          if ($("#regDependantTitle").text() === "Add Client Dependant") {
            notification(
              client.addDependant(clientDependantParams()).created,
              "center",
              "success",
              "dependant",
              "Add Client Dependant",
              "Client Depandant has been updated successfully",
              true,
              3000
            );
          } else if ($("#regDependantTitle").text() === "Edit Client Dependant") {
            notification(
              client.updateDependant(clientDependantParams()).updated,
              "center",
              "success",
              "dependant",
              "Edit Client Dependant",
              "Client Depandant has been updated successfully",
              true,
              3000
            );
          }
        }
    
    });

    $(document).on("click", "#delClientDependantBtn", function () {
        let id = $("#delDependantId").val();
        notification(
          client.delDependant(id).deleted,
          "center",
          "success",
          "delete-dependant",
          "Delete Client Dependant",
          "Client dependant has been deleted successfully",
          true,
          3000
        );
    });

    // CLIENT DEPENDANT
    $(document).on("show.bs.modal", dependantModal, function (e) {
        clearFields();
        let opener = e.relatedTarget;
        let actionType = $(opener).attr("data-action-type");

        if (actionType === "add") {
            $("#regDependantTitle").text("Add Client Dependant");
        } else if (actionType === "edit") {
            $("#regDependantTitle").text("Edit Client Dependant");

            $.each(opener.dataset, function (key, value) {
                $(dependantModal).find(`[id = '${key}']`).val(value);
            });
        }
    });

    $(document).on("show.bs.modal", "#modal-del-client-dependant", function (e) {
        let opener = e.relatedTarget;
        $.each(opener.dataset, function (key, value) {
          $("#modal-del-client-dependant").find(`[id = '${key}']`).val(value);
        });
      });
});

function clientDependantParams() {
    let id = $("#clientDependantId").val();
    let dependancy = $("#dependancy").val();
    let amount = $("#amount").val();
    let relationship = $("#relationship option:selected").val();
    let frequency = $("#frequency option:selected").val();
  
    let params = {
      id: id,
      client_id: currentDataset.recordId,
      dependancy: dependancy,
      amount: amount,
      relationship: relationship,
      frequency: frequency
    };
  
    return params;
  }