import * as client from "../services/clients.js";
import * as form from "../utils/forms.js";
import * as loadContent from "../actions/contentLoader.js";
import { loadIdentifierTypes } from "../services/users.js";

let modalId = "#modal-register-client";
let clientType = null;
let currentDataset = null;


const otherloanModal = "#modal-client-otherloan";

localStorage;

$(function () {

  if (localStorage.getItem("clientDataSet") != null) {
    currentDataset = JSON.parse(localStorage.getItem("clientDataSet"));
  }

  $(document).on("show.bs.modal", modalId, function (e) {
    let opener = e.relatedTarget;
    let actionType = $(opener).attr("data-action-type");
    clientType = $(opener).attr("data-client-type");

    if (clientType === "organization") {
      loadForm("clientRegistration", "views/clients/organizationForm.html");
    } else if (clientType === "individual") {
      $.when(loadForm("clientRegistration", "views/clients/individualForm.html")).done(function () {
        loadIdentifierTypes();
      });
    }

    if (actionType === "edit") {
      $(modalId).find(`[id = 'regModalTitle']`).text("Edit Client");
      $.each(opener.dataset, function (key, value) {
        if (key === "registered") {
          $(modalId).find(`[id = '${key}']`).prop("checked", value);
        } else {
          $(modalId).find(`[id = '${key}']`).val(value).change();
        }
      });
    } else {
      $(modalId).find(`[id = 'regModalTitle']`).text("Add Client");
    }
  });

  $(document).on("show.bs.modal", "#modal-del-client", function (e) {
    let opener = e.relatedTarget;
    clientType = $(opener).attr("data-client-type");

    $("#modal-del-client")
      .find(`[id = 'delClientId']`)
      .val($(opener).attr("data-id"));
  });

  $(document).on("click", "#delClientBtn", function (e) {
    let client_id = $("#delClientId").val();
    let void_reason = $("#reason").val();

    $.when(
      notification(
        client.delClient(client_id, void_reason).deleted,
        "center",
        "success",
        "client",
        "Delete Client",
        "Client has been deleted successfully",
        true,
        3000
      )
    ).done(function () {
      $.when(client.fetchClientsData(clientType)).done(function () {
        $("#modal-del-client").modal("hide");
      });
    });
  });

  $(document).on("click", "#registerBtn", function (e) {

    if (clientType != null) {
      if ($("#regModalTitle").text() === "Edit Client") {
        if (clientType === "individual") {
          if (form.validClientFormData()) {
            notification(
              client.editClient(individualParams()).updated,
              "center",
              "success",
              "registration",
              "Edit Individual Client",
              "Client has been updated successfully",
              true,
              3000
            );
          }
        } else {
          notification(
            client.editClient(organizationParams()),
            "center",
            "success",
            "registration",
            "Edit Organization Client",
            "Client has been updated successfully",
            true,
            3000
          );
        }
      } else {
        if (clientType === "individual") {
          if (form.validClientFormData()) {
            notification(
              client.addClient(individualParams()),
              "center",
              "success",
              "registration",
              "Add Individual Client",
              "Client has been added successfully",
              true,
              3000
            );
          }
        } else {
          notification(
            client.addClient(organizationParams()),
            "center",
            "success",
            "registration",
            "Add Organization Client",
            "Client has been added succefully",
            true,
            3000
          );
        }
      }
    }


  });

  $(document).on("click", ".recordBtn", function (e) {
    let opener = e.relatedTarget;

    currentDataset = this.dataset;
    localStorage.setItem("clientDataSet", JSON.stringify(currentDataset));

    let clientType = this.dataset.clientType;

    if (clientType === "individual") {
      loadContent.loadRecord("views/clients/individualRecord.html", "client_records");
      $("#recordName").text(
        `${this.dataset.recordFirstname} ${this.dataset.recordLastname} Records`
      );
    } else if (clientType === "organization") {
      loadContent.loadRecord("views/clients/organizationRecord.html", "organization_records");
    }
  });

  $(document).on("click", "#addClientForm", function (e) {
    $.when(loadContent.loadIndividualRecordView("views/forms/client.html", "client_form")).done(
      function () {
        $.each(currentDataset, function (key, value) {
          $("#demographics").find(`[id = '${key}']`).text(value);
        });

        $("#recordName").text(
          `${currentDataset.recordFirstname} ${currentDataset.recordLastname} Demographics`
        );

        loadIdentifierTypes();
      }
    );
  });

  $(document).on("click", "#btnDemographics", function (e) {
    $.when(loadContent.loadIndividualRecordView("views/clients/demographics.html", "demographics")).done(
      function () {
        $.each(currentDataset, function (key, value) {
          $("#demographics").find(`[id = '${key}']`).text(value);
          console.log(key)
          console.log(value)
        });

        $("#recordName").text(
          `${currentDataset.recordFirstname} ${currentDataset.recordLastname} Demographics`
        );
      }
    );
  });

  $(document).on("click", "#recordBackBtn", function () {
    clientType = currentDataset.clientType;
    if (clientType === "individual") {
      loadContent.loadRecord("views/clients/individualRecord.html", "client_records");
      $("#recordName").text(
        `${currentDataset.recordFirstname} ${currentDataset.recordLastname} Records`
      );
    } else if (clientType === "organization") {
      loadContent.loadRecord("views/clients/organizationRecord.html", "organization_records");
    }
  });

  $(document).on("click", "#clientsBackBtn", function () {
    clientType = this.dataset.clientType;
    if (clientType === "individual") {
      $.when(loadContent.loadRecord("views/clients/individuals.html", "individual")).done(function () {
        client.fetchClientsData(clientType);
      });
    } else if (clientType === "organization") {
      $.when(loadContent.loadRecord("views/clients/organizations.html", "organization")).done(function () {
        client.fetchClientsData(clientType);
      });
    }
  });


  $(document).on("click", "#downloadClientRecord", function (e) {
    $.when(client.getClientRecordReport({ client_id: currentDataset.recordId })).done(function (htmlContent) {
      if (htmlContent) {
        let win = window.open("", "", "");
        win.document.write(htmlContent.html)
        win.document.close();
        win.print();
      } else {
        console.error("HTML content is null or empty.");
      }
    })
  });

});



//CLIENT REGISTRATION METHODS

function individualParams() {
  let client_id = $("#id").val();
  let identifier = $("#identifier").val();
  let identifierTypeId = $("#identifierType").val();
  let firstname = $("#firstname").val();
  let lastname = $("#lastname").val();
  let gender = $("#gender option:selected").val();
  let date_of_birth = $("#dateOfBirth").val();
  let home_district = $("#homeDistrict option:selected").val();
  let home_ta = $("#homeTa").val();
  let home_village = $("#homeVillage").val();
  let current_district = $("#currentDistrict option:selected").val();
  let current_ta = $("#currentTa").val();
  let current_village = $("#currentVillage").val();
  let nearest_landmark = $("#nearest_landmark option:selected").val();

  let params = {
    client_id: client_id,
    client_type: clientType,
    identifier: identifier,
    identifier_type_id: identifierTypeId,
    firstname: firstname,
    lastname: lastname,
    gender: gender,
    date_of_birth: date_of_birth,
    home_district: home_district,
    home_ta: home_ta,
    home_village: home_village,
    current_district: current_district,
    current_ta: current_ta,
    current_village: current_village,
    nearest_landmark: nearest_landmark,
  };

  return params;
}

function organizationParams(type) {
  let clientId = $("#id").val();
  let name = $("#name").val();
  let category = $("#orgCategory").val();
  let startDate = $("#startDate").val();
  let purpose = $("#purpose").val();
  let emailAddress = $("#emailAddress").val();
  let phoneNumber = $("#phoneNumber").val();
  let officeLocation = $("#officeLocation").val();
  let postalAddress = $("#postalAddress").val();
  let registered = $("#registered").val();

  let params = {
    client_id: clientId,
    client_type: clientType,
    name: name,
    category: category,
    start_date: startDate,
    purpose: purpose,
    email_address: emailAddress,
    phone_number: phoneNumber,
    office_location: officeLocation,
    postal_address: postalAddress,
    registered: registered,
  };

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
          $.when(client.fetchClientsData(clientType)).done(function () {
            $(modalId).modal("hide");
          });
          break;
        case "job":
          $.when(
            client.fetchClientJobs({
              client_id: currentDataset.recordId,
            })
          ).done(function () {
            $(jobModal).modal("hide");
          });
          break;
        case "delete-job":
          $.when(
            client.fetchClientJobs({
              client_id: currentDataset.recordId,
            })
          ).done(function () {
            $("#modal-del-client-job").modal("hide");
          });
          break;
        case "dependant":
          $.when(
            client.fetchClientDependants({
              client_id: currentDataset.recordId,
            })
          ).done(function () {
            $(dependantModal).modal("hide");
          });
          break;
        case "delete-dependant":
          $.when(
            client.fetchClientDependants({
              client_id: currentDataset.recordId,
            })
          ).done(function () {
            $("#modal-del-client-dependant").modal("hide");
          });
          break;
        case "business":
          $.when(
            client.fetchClientBusinesses({
              client_id: currentDataset.recordId,
            })
          ).done(function () {
            $(businessModal).modal("hide");
          });
          break;
        case "asset":
          $.when(
            client.fetchClientAssets({
              client_id: currentDataset.recordId,
            })
          ).done(function () {
            $(assetModal).modal("hide");
          });
          break;
        case "otherloan":
          $.when(
            client.fetchClientOtherLoans({
              client_id: currentDataset.recordId,
            })
          ).done(function () {
            $(otherloanModal).modal("hide");
          });
          break;
      }
    });
}

function clearFields(formId) {
  $(":input", formId)
    .not(":button, :submit, :reset")
    .val("")
    .prop("checked", false)
    .prop("selected", false);
}

