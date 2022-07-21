import * as client from "../services/clients.js";
import { notify } from "../services/utils.js";
import { loadContent } from "../actions/contentLoader.js";

let modalId = "#modal-register-client";
let clientType = null;
let currentDataset = null;
let jobModal = "#modal-client-job";
let dependantModal = "#modal-client-dependant";

localStorage;

$(function () {
  $(document).on("show.bs.modal", modalId, function (e) {
    let opener = e.relatedTarget;
    let actionType = $(opener).attr("data-action-type");
    clientType = $(opener).attr("data-client-type");

    if (clientType === "organization") {
      loadForm("clientRegistration", "views/clients/organizationForm.html");
    } else if (clientType === "individual") {
      loadForm("clientRegistration", "views/clients/individualForm.html");
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
          updateNotification(
            client.editClient(individualParams()),
            "registration",
            "Edit Individual Client",
            "Client"
          );
        else
          updateNotification(
            client.editClient(organizationParams()),
            "registration",
            "Edit Organization Client",
            "Client"
          );
      } else {
        if (clientType === "individual")
          addNotification(
            client.addClient(individualParams()),
            "registration",
            "Add Individual Client",
            "Client"
          );
        else
          addNotification(
            client.addClient(organizationParams()),
            "registration",
            "Add Organization Client",
            "Client"
          );
      }
    }
  });

  $(document).on("click", ".recordBtn", function (e) {
    let opener = e.relatedTarget;

    currentDataset = this.dataset;

    let clientType = this.dataset.clientType;

    if (clientType === "individual") {
      loadRecord("views/clients/individualRecord.html");
      $("#recordName").text(
        `${this.dataset.recordFirstname} ${this.dataset.recordLastname} Records`
      );
    } else if (clientType === "organization") {
      loadRecord("views/clients/organizationRecord.html");
    }
  });

  $(document).on("click", "#btnDemographics", function (e) {
    $.when(loadIndividualRecordView("views/clients/demographics.html")).done(
      function () {
        $.each(currentDataset, function (key, value) {
          $("#demographics").find(`[id = '${key}']`).text(value);
        });

        $("#recordName").text(
          `${currentDataset.recordFirstname} ${currentDataset.recordLastname} Demographics`
        );
      }
    );
  });

  $(document).on("click", "#btnJobs", function (e) {
    $.when(loadIndividualRecordView("views/clients/jobs.html")).done(
      function () {
        $("#recordName").text(
          `${currentDataset.recordFirstname} ${currentDataset.recordLastname} Jobs`
        );

        client.fetchClientJobs({
          client_id: currentDataset.recordId,
        });
      }
    );
  });

  $(document).on("click", "#btnDependants", function (e) {
    $.when(loadIndividualRecordView("views/clients/dependants.html")).done(
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


  $(document).on("click", "#btnBusinesses", function (e) {
    $.when(loadIndividualRecordView("views/clients/businesses.html")).done(
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



  //CLIENT JOB MODAL
  $(document).on("show.bs.modal", jobModal, function (e) {
    let opener = e.relatedTarget;
    let actionType = $(opener).attr("data-action-type");

    $.when(loadForm("clientJobForm", "views/clients/jobForm.html")).done(
      function () {
        if (actionType === "add") {
          $("#regJobTitle").text("Add Client Job");
        } else if (actionType === "edit") {
          $("#regJobTitle").text("Edit Client Job");

          $.each(opener.dataset, function (key, value) {
            $(jobModal).find(`[id = '${key}']`).val(value);
          });
        }
      }
    );
  });

  $(document).on("show.bs.modal", "#modal-del-client-job", function (e) {
    let opener = e.relatedTarget;
    $.each(opener.dataset, function (key, value) {
      $("#modal-del-client-job").find(`[id = '${key}']`).val(value);
    });
  });

  $(document).on("click", "#recordBackBtn", function () {
    clientType = currentDataset.clientType;
    if (clientType === "individual") {
      loadRecord("views/clients/individualRecord.html");
      $("#recordName").text(
        `${currentDataset.recordFirstname} ${currentDataset.recordLastname} Records`
      );
    } else if (clientType === "organization") {
      loadRecord("views/clients/organizationRecord.html");
    }
  });

  $(document).on("click", "#clientsBackBtn", function () {
    clientType = this.dataset.clientType;
    if (clientType === "individual") {
      $.when(loadRecord("views/clients/individuals.html")).done(function () {
        client.fetchClientsData(clientType);
      });
    } else if (clientType === "organization") {
      $.when(loadRecord("views/clients/organizations.html")).done(function () {
        client.fetchClientsData(clientType);
      });
    }
  });

  $(document).on("click", "#saveJobBtn", function (e) {
    if ($("#regJobTitle").text() === "Add Client Job") {
      addNotification(
        client.addJob(clientJobParams()),
        "job",
        "Add Client Job",
        "Client"
      );
    } else if ($("#regJobTitle").text() === "Edit Client Job") {
      updateNotification(
        client.updateJob(clientJobParams()),
        "job",
        "Add Client Job",
        "Client"
      );
    }
  });

  $(document).on("click", "#delClientJobBtn", function () {
    let id = $("#delClientJobId").val();

    deleteNotification(
      client.delJob(id),
      "job",
      "Delete Client Job",
      "Client job"
    );
  });
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

$(document).on("click", "#saveDependantBtn", function (e) {
  if ($("#regDependantTitle").text() === "Add Client Dependant") {
    addNotification(
      client.addDependant(clientDependantParams()),
      "dependant",
      "Add Client Dependant",
      "Client Depandant"
    );
  } else if ($("#regDependantTitle").text() === "Edit Client Dependant") {
    updateNotification(
      client.updateDependant(clientDependantParams()),
      "dependant",
      "Edit Client Dependant ",
      "Client Dependant"
    );
  }
});

$(document).on("click", "#delClientDependantBtn", function () {
  let id = $("#delDependantId").val();
  deleteNotification(
    client.delDependant(id),
    "dependant",
    "Delete Client Dependant",
    "Client dependant"
  );
});

///
function clientJobParams() {
  let id = $("#clientJobId").val();
  let title = $("#title").val();
  let department = $("#department").val();
  let employerType = $("#employerType").val();
  let employerName = $("#employerName").val();
  let employementType = $("#employmentType").val();
  let dateStarted = $("#dateStarted").val();
  let contractDue = $("#contractDue").val();
  let netSalary = $("#netSalary").val();
  let grossSalary = $("#grossSalary").val();
  let payDate = $("#payDate").val();
  let postalAddress = $("#postalAddress").val();
  let email = $("#emailAddress").val(); //Phone Number
  let phoneNumber = $("#phoneNumber").val();
  let district = $("#district").val();

  let params = {
    id: id,
    client_id: currentDataset.recordId,
    title: title,
    department: department,
    employer_type: employerType,
    employer_name: employerName,
    employment_type: employementType,
    date_started: dateStarted,
    contract_due: contractDue,
    net_salary: netSalary,
    gross_salary: grossSalary,
    pay_date: payDate,
    postal_address: postalAddress,
    email_address: email,
    phone_number: phoneNumber,
    district: district,
  };

  return params;
}

function clientDependantParams() {
  let id = $("#clientDependantId").val();
  let dependancy = $("#dependancy").val();
  let amount = $("#amount").val();
  let relationship = $("#relationship").val();
  let frequency = $("#frequency").val();

  let params = {
    id: id,
    client_id: currentDataset.recordId,
    dependancy: dependancy,
    amount: amount,
    relationship: relationship,
    frequency: frequency,
  };

  return params;
}

//CLIENT REGISTRATION METHODS

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

//FORMS AND CLIENT RECORDS METHODS
function loadForm(id, path) {
  $.when(loadContent(id, "", path)).done(function () {});
}

function loadIndividualRecordView(path) {
  $.when(loadContent("mainContent", "", path)).done(function () {});
}

function loadRecord(path) {
  $.when(loadContent("mainContent", "", path)).done(function () {});
}

//========================>

function updateNotification(resp, actionType, title, message) {
  if (resp.updated) {
    $.when(
      notify(
        "center",
        "success",
        title,
        `${message} has been updated successfully`,
        false,
        3000
      )
    ).done(function () {
      switch (actionType) {
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
        case "dependant":
          $.when(
            client.fetchClientDependants({
              client_id: currentDataset.recordId,
            })
          ).done(function () {
            $(dependantModal).modal("hide");
          });
          break;
      }
    });
  }
}

function addNotification(resp, actionType, title, message) {
  if (resp.id != null) {
    $.when(
      notify(
        "center",
        "success",
        title,
        `${message} has been added successfully`,
        false,
        3000
      )
    ).done(function () {
      switch (actionType) {
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
        case "dependant":
          $.when(
            client.fetchClientDependants({
              client_id: currentDataset.recordId,
            })
          ).done(function () {
            $(dependantModal).modal("hide");
          });
          break;
      }
    });
  }
}

function deleteNotification(resp, actionType, title, message) {
  if (resp.deleted) {
    $.when(
      notify(
        "center",
        "success",
        title,
        `${message} has been deleted successfully`,
        false,
        3000
      )
    ).done(function () {
      $.when(client.fetchClientsData(clientType)).done(function () {});

      switch (actionType) {
        case "registration":
          $.when(client.fetchClientsData(clientType)).done(function () {
            $("#modal-del-client").modal("hide");
          });
          break;
        case "job":
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
            $("#modal-del-client-dependant").modal("hide");
          });
          break;
      }
    });
  }
}


function clearFields() {
  $("#dependancy").val("");
  $("#amount").val("");
  $("#frequency").val("");
  $("#relationship").val("");
}
