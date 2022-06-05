import * as client from "../services/clients.js";
import { notify } from "../services/utils.js";
import { loadContent } from "../actions/contentLoader.js";

let modalId = "#modal-register-client";
let clientType = null;
let clientTypeModal = `#modal-client-type`;

$(function () {
  $(document).on("show.bs.modal", modalId, function (e) {
    let opener = e.relatedTarget;

    if ($(opener).attr("data-action-type") === "edit") {
      $(modalId).find(`[id = 'regModalTitle']`).text("Edit Client");
      $.each(opener.dataset, function (key, value) {
        $(modalId).find(`[id = '${key}']`).val(value);
      });
    } else {
      $(modalId).find(`[id = 'regModalTitle']`).text("Add Client");
    }
  });

  $(document).on("show.bs.modal", "#modal-del-client", function (e) {
    $("#modal-del-client")
      .find(`[id = 'delClientId']`)
      .val($(e.relatedTarget).attr("data-id"));
  });

  $(document).on("click", "#delClientBtn", function (e) {
    let id = $("#delClientId").val();
    let void_reason = $("#reason").val();

    client.delClient(id, void_reason);
  });

  $(document).on("click", ".client-type-selected", function () {
    clientType = $(this).attr("id");
    if (clientType === "individual") {
      $(clientTypeModal).modal("hide");
      $(modalId).modal("show");
      loadForm("views/clients/individualForm.html");
    } else if (clientType === "organization") {
      $(clientTypeModal).modal("hide");
      $(modalId).modal("show");
      loadForm("views/clients/organizationForm.html");
    }
  });

  $(document).on("click", "#registerBtn", function (e) {
    if ($("#regModalTitle").text() === "Edit Client") {
      updateNotification(client.editClient(params));
    } else {
      if (clientType === "individual") client.addClient(individualParams());
      else client.addClient(organizationParams());
    }
  });
});

function individualParams() {
  let national_id = $("#nationalId").val();
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
    client_type: "individual",
    national_id: national_id,
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

function organizationParams() {
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
    client_type: "organization",
    name: name,
    category: category,
    startDate: startDate,
    purpose: purpose,
    email_address: emailAddress,
    phone_number: phoneNumber,
    office_location: officeLocation,
    postal_address: postalAddress,
    registered: registered,
  };

  return params;
}

function loadForm(path) {
  $.when(loadContent("clientRegistration", "", path)).done(function () {});
}

function updateNotification(resp) {
  if (resp.updated) {
    $.when(
      notify(
        "center",
        "success",
        "Edit Client",
        "Client has been updated successfully",
        false,
        1500
      )
    ).done(function () {
      $.when(client.fetchClientsData()).done(function () {
        $(modalId).modal("hide");
      });
    });
  }
}
