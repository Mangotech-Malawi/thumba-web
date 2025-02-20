import * as client from "../services/clients.js";
import * as form from "../utils/forms.js";
import * as loadContent from "../actions/contentLoader.js";
import { loadIdentifierTypes } from "../services/users.js";
import { notify } from "../utils/utils.js";

let cameraFeed = document.getElementById("cameraFeed");
let cameraCanvas = document.getElementById("cameraCanvas");
let profilePicture = document.getElementById("profilePicture");
let browseBtn = document.getElementById("browseBtn");


let modalId = "#modal-register-client";
const organizationClientForm = "#organizationClientForm";
const individualClientForm = "#individualClientForm";
let clientType = null;
let currentDataset = null;
let selectedClients = null;


const otherloanModal = "#modal-client-otherloan";

localStorage;

$(function () {

  if (localStorage.getItem("clientDataSet") != null) {
    currentDataset = JSON.parse(localStorage.getItem("clientDataSet"));
  }

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

  $(document).on("click", "#saveIndividualClientBtn", function (e) {

    if (form.validClientFormData()) {
      if ($("#cardTitle").text() === "Add Client") {
        notification(
          client.addClient(individualParams()).updated,
          "center",
          "success",
          "registration",
          "Edit Individual Client",
          "Client has been updated successfully",
          true,
          3000
        );
      } else if ($("#cardTitle").text() === "Edit Client") {
        notification(
          client.editClient(individualParams()).updated,
          "center",
          "success",
          "registration",
          "Add Individual Client",
          "Client has been added successfully",
          true,
          3000
        );
      }

    }
  });

  $(document).on("click", "#saveOrgClientBtn", function (e) {
    if (form.validOrgClientFormData()) {
      if ($("#cardTitle").text().trim() === "Add Client") {
        notification(
          client.addClient(organizationParams()),
          "center",
          "success",
          "registration",
          "Add Individual Client",
          "Client has been added successfully",
          true,
          3000
        );
      } else if ($("#cardTitle").text().trim() === "Edit Client") {
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
    }

  });


  $(document).on("click", ".recordBtn", function (e) {
    let opener = e.relatedTarget;

    currentDataset = this.dataset;
    localStorage.setItem("clientDataSet", JSON.stringify(currentDataset));

    let clientType = this.dataset.clientType;

    if (clientType === "individual") {
      loadContent.loadRecord("views/clients/individualRecord.html", "individual_records");
      $("#recordName").text(
        `${this.dataset.recordFirstname} ${this.dataset.recordLastname} Records`
      );
    } else if (clientType === "organization") {
      loadContent.loadRecord("views/clients/organizationRecord.html", "organization_records");
      $("#recordName").text(
        `${this.dataset.orgName} Records`
      );
    } else if (clientType === "group") {
      loadContent.loadRecord("views/clients/groupRecord.html", "group_records");
      $("#recordName").text(
        `${this.dataset.groupName} Records`
      );
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

  $(document).on("click", "#addOrganizationClientForm", function (e) {
    $.when(loadContent.loadIndividualRecordView("views/forms/organization.html", "client_organization_form")).done(
      function () {

        loadIdentifierTypes();
      }
    );
  });

  $(document).on("click", ".edit-client", function (e) {
    const data = $(this).data();

    if (data.clientType === "individual") {
      $.when(loadContent.loadIndividualRecordView("views/forms/client.html", "client_form")).done(
        function () {
          loadIdentifierTypes();

          $("#cardTitle").text("Edit Client");

          if (data.identifierTypeId) {
            $("#identifierType").val(data.identifierTypeId).trigger("change");
          }

          $.each(data, function (key, value) {
            $(individualClientForm).find(`[id = '${key}']`).val(value);
          });

        }
      );
    } else if (data.clientType === "organization") {

      $.when(loadContent.loadIndividualRecordView("views/forms/organization.html", "client_organization_form")).done(
        function () {
          $("#cardTitle").text("Edit Client");

          $.each(data, function (key, value) {
            $(organizationClientForm).find(`[id = '${key}']`).val(value);
          });

        }
      );
    }

  });


  $(document).on("click", "#createGroupForm", function (e) {

  });

  $(document).on("show.bs.modal", "#modal-group-client", function (e) {
    selectedClients = client.getSelectedClients();

    if (typeof selectedClients != undefined && selectedClients != "" && selectedClients != null) {
      if (selectedClients.length > 1) {

      } else {
        notify(
          "center",
          "error",
          "Cannot create group",
          "More than one client should be selected",
          true,
          3000)
      }
    } else {
      notify(
        "center",
        "error",
        "Cannot create group",
        "Please select clients to create a group",
        true,
        3000)
    }
  });

  $(document).on("click", "#saveGroupBtn", function (e) {

    const groupId = $("#groupId").val();
    const groupName = $("#groupName").val();
    const category = $("#category").val();

    const group_params = {
      group_id: groupId,
      group_name: groupName,
      category: category,
      group_clients: selectedClients,
      client_type: "group"
    }

    if (form.validGroupClientFormData()) {
      notification(
        client.addClient(group_params),
        "center",
        "success",
        "registration",
        "Add Group Client",
        "Client has been added successfully",
        true,
        3000
      );
    }


  });


  $(document).on("click", "#btnDemographics", function (e) {
    $.when(loadContent.loadIndividualRecordView("views/clients/demographics.html", "demographics")).done(
      function () {
        $.each(currentDataset, function (key, value) {
          $("#demographics").find(`[id = '${key}']`).text(value);
        });

        $("#profilePicture").attr("src", `http://127.0.0.1:3000${currentDataset.profilePicture}`);

        $("#recordName").text(
          `${currentDataset.recordFirstname} ${currentDataset.recordLastname} Demographics`
        );
      }
    );
  });

  $(document).on("click", "#recordBackBtn", function () {
    clientType = currentDataset.clientType;
    if (clientType === "individual") {
      loadContent.loadRecord("views/clients/individualRecord.html", "individual_records");
      $("#recordName").text(
        `${currentDataset.recordFirstname} ${currentDataset.recordLastname} Records`
      );
    } else if (clientType === "organization") {
      loadContent.loadRecord("views/clients/organizationRecord.html", "organization_records");
      `${currentDataset.orgName} Records`
    } else if (clientType === "group") {
      loadContent.loadRecord("views/clients/groupRecord.html", "group_records");
      `${currentDataset.groupName} Records`
    }
  });

  $(document).on("click", "#clientsBackBtn", function () {
    clientType = currentDataset.clientType
    if (clientType === "individual") {
      $.when(loadContent.loadRecord("views/clients/individuals.html", "individual")).done(function () {
        client.fetchClientsData(clientType);
      });
    } else if (clientType === "organization") {
      $.when(loadContent.loadRecord("views/clients/organizations.html", "organization")).done(function () {
        client.fetchClientsData(clientType);
      });
    } else if (clientType === "group"){
      $.when(loadContent.loadRecord("views/clients/groups.html", "group")).done(function () {
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
    });


  });


  $(document).on("click", "#uploadImageBtn", async function (e) {
    e.preventDefault();

    // Get the file input
    const fileInput = document.getElementById("profilePictureInput");

    // Access the captured image file
    const files = fileInput.files; // Contains the captured image
    const imageFile = files ? files[0] : null;

    if (imageFile) {
      client.uploadImage(currentDataset.recordId, imageFile);
    } else {
      console.error("No file selected or captured.");
      alert("Please capture or select an image before uploading.");
    }
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
  let startDate = $("#busStartDate").val();
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



