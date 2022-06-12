import * as client from "../services/clients.js";
import { notify } from "../services/utils.js";
import { loadContent } from "../actions/contentLoader.js";

let modalId = "#modal-register-client";
let clientType = null;

localStorage;

$(function () {
  $(document).on("show.bs.modal", modalId, function (e) {
    let opener = e.relatedTarget;
    let actionType = $(opener).attr("data-action-type");
    clientType = $(opener).attr("data-client-type");

    if (clientType === "organization") {
      loadForm("views/clients/organizationForm.html");
    } else if (clientType === "individual") {
      loadForm("views/clients/individualForm.html");
    }

    if (actionType === "edit") {
      $(modalId).find(`[id = 'regModalTitle']`).text("Edit Client");
      $.each(opener.dataset, function (key, value) {
        if (key === "registered") {
          $(modalId).find(`[id = '${key}']`).prop("checked", value);
        } else {
          $(modalId).find(`[id = '${key}']`).val(value);
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

    deleteNotification(client.delClient(client_id, void_reason));
  });

  $(document).on("click", "#registerBtn", function (e) {
    if (clientType != null) {
      if ($("#regModalTitle").text() === "Edit Client") {
        if (clientType === "individual")
          updateNotification(client.editClient(individualParams()));
        else updateNotification(client.editClient(organizationParams()));
      } else {
        if (clientType === "individual") addNotification(client.addClient(individualParams()));
        else addNotification(client.addClient(organizationParams()));
      }
    }
  });
});

function individualParams() {
  let client_id = $("#id").val();
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
    client_id: client_id,
    client_type: clientType,
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
        3000
      )
    ).done(function () {
   
      $.when(client.fetchClientsData(clientType)).done(function () {
        $(modalId).modal("hide");
      });
    });
  }
}

function addNotification(resp) {
  if (resp.id != null ) {
    $.when(
      notify(
        "center",
        "success",
        "Add Client",
        "Client has been added succesfully",
        false,
        3000
      )
    ).done(function (){
      $.when(client.fetchClientsData(clientType)).done(function () {
        $(modalId).modal("hide");
      });
    });
  }
}


function deleteNotification(resp) {
  if (resp.deleted) {
    $.when(
      notify(
        "center",
        "success",
        "Delete Client",
        "Client has been deleted succesfully",
        false,
        3000
      )
    ).done(function (){
      console.log("Somthing eeeh" + clientType);
      $.when(client.fetchClientsData(clientType)).done(function () {
        $("#modal-del-client").modal("hide");
      });
    });
  }
}

