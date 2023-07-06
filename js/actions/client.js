import * as client from "../services/clients.js";
import { loadContent } from "../actions/contentLoader.js";
import * as form from "../utils/forms.js";


let modalId = "#modal-register-client";
let clientType = null;
let currentDataset = null;
const jobModal = "#modal-client-job";
const dependantModal = "#modal-client-dependant";
const businessModal = "#modal-client-business";
const assetModal = "#modal-client-asset";
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
    if (form.validClientFormData()) {
      if (clientType != null) {
        if ($("#regModalTitle").text() === "Edit Client") {
          if (clientType === "individual")
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
          else
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
        } else {
          if (clientType === "individual")
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
          else
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
      loadRecord("views/clients/individualRecord.html", "client_records");
      $("#recordName").text(
        `${this.dataset.recordFirstname} ${this.dataset.recordLastname} Records`
      );
    } else if (clientType === "organization") {
      loadRecord("views/clients/organizationRecord.html", "organization_records");
    }
  });

  $(document).on("click", "#btnDemographics", function (e) {
    $.when(loadIndividualRecordView("views/clients/demographics.html", "demographics")).done(
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
    $.when(loadIndividualRecordView("views/clients/jobs.html", "jobs")).done(
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
    $.when(loadIndividualRecordView("views/clients/dependants.html", "dependants")).done(
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
    $.when(loadIndividualRecordView("views/clients/businesses.html", "businesses")).done(
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

  $(document).on("click", "#btnAssets", function (e) {
    $.when(loadIndividualRecordView("views/clients/assets.html", "assets")).done(
      function () {
        $("#recordName").text(
          `${currentDataset.recordFirstname} ${currentDataset.recordLastname} Assets`
        );

        client.fetchClientAssets({
          client_id: currentDataset.recordId,
        });
      }
    );
  });

  $(document).on("click", "#btnOtherLoans", function (e) {
    $.when(loadIndividualRecordView("views/clients/otherLoans.html", "other_loans")).done(
      function () {
        $("#recordName").text(
          `Other Loans of ${currentDataset.recordFirstname} ${currentDataset.recordLastname}`
        );

        client.fetchClientOtherLoans({
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
      loadRecord("views/clients/individualRecord.html", "client_records");
      $("#recordName").text(
        `${currentDataset.recordFirstname} ${currentDataset.recordLastname} Records`
      );
    } else if (clientType === "organization") {
      loadRecord("views/clients/organizationRecord.html", "organization_records");
    }
  });

  $(document).on("click", "#clientsBackBtn", function () {
    clientType = this.dataset.clientType;
    if (clientType === "individual") {
      $.when(loadRecord("views/clients/individuals.html", "individual")).done(function () {
        client.fetchClientsData(clientType);
      });
    } else if (clientType === "organization") {
      $.when(loadRecord("views/clients/organizations.html", "organization")).done(function () {
        client.fetchClientsData(clientType);
      });
    }
  });

  $(document).on("click", "#saveJobBtn", function (e) {
    if (form.validClientJobFormData()) {
      if ($("#regJobTitle").text() === "Add Client Job") {
        notification(
          client.addJob(clientJobParams()).created,
          "center",
          "success",
          "job",
          "Add Client Job",
          "Client Job has been updated successfully",
          true,
          3000
        );
      } else if ($("#regJobTitle").text() === "Edit Client Job") {
        notification(
          client.updateJob(clientJobParams()).updated,
          "center",
          "success",
          "job",
          "Edit Client Job",
          "Client Job has been updated successfully",
          true,
          3000
        );
      }
    }
  });

  $(document).on("click", "#delClientJobBtn", function () {
    let id = $("#delClientJobId").val();

    notification(
      client.delJob(id).deleted,
      "center",
      "danger",
      "delete-job",
      "Delete Client Job",
      "Client Job has been deleted successfully",
      true,
      3000
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

$(document).on("show.bs.modal", "#modal-del-client-business", function (e) {
  let opener = e.relatedTarget;
  $.each(opener.dataset, function (key, value) {
    $("#modal-del-client-business").find(`[id = '${key}']`).val(value);
  });
});

$(document).on("click", "#saveBusinessBtn", function (e) {
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

//Client Assets
$(document).on("click", "#saveAssetBtn", function (e) {
  if ($("#regAssetTitle").text() === "Add Client Asset") {
    notification(
      client.addAsset(clientAssetParams()).created,
      "center",
      "success",
      "asset",
      "Add Client Asset",
      "Client Asset has been added successfully",
      true,
      3000
    );
  } else if ($("#regAssetTitle").text() === "Edit Client Asset") {
    notification(
      client.updateAsset(clientAssetParams()).updated,
      "center",
      "success",
      "asset",
      "Edit Client Asset",
      "Client Asset has been updated successfully",
      true,
      3000
    );
  }
});

$(document).on("show.bs.modal", assetModal, function (e) {
  clearFields();
  let opener = e.relatedTarget;
  let actionType = $(opener).attr("data-action-type");

  if (actionType === "add") {
    $("#regAssetTitle").text("Add Client Asset");
  } else if (actionType === "edit") {
    $("#regAssetTitle").text("Edit Client Asset");
    $.each(opener.dataset, function (key, value) {
      $(assetModal).find(`[id = '${key}']`).val(value);
    });
  }
});

$(document).on("show.bs.modal", "#modal-del-client-asset", function (e) {
  let opener = e.relatedTarget;
  $.each(opener.dataset, function (key, value) {
    $("#modal-del-client-asset").find(`[id = '${key}']`).val(value);
  });
});

$(document).on("click", "#delClientAssetBtn", function (e) {
  let id = $("#delAssetId").val();
  $.when(
    notification(
      client.delAsset(id).deleted,
      "center",
      "success",
      "asset",
      "Delete Client Asset",
      "Client Asset has been deleted successfully",
      true,
      3000
    )
  ).done(function () {
    $("#modal-del-client-asset").modal("hide");
  });
});

//Client Other Loans
$(document).on("click", "#saveOtherLoanBtn", function (e) {
  if ($("#regOtherLoanTitle").text() === "Add Client Other Loan") {
    notification(
      client.addOtherLoan(clientOtherLoanParams()).created,
      "center",
      "success",
      "otherloan",
      "Add Client Other Loan",
      "Client other loan has been added successfully",
      true,
      3000
    );
  } else if ($("#regOtherLoanTitle").text() === "Edit Client Other Loan") {
    notification(
      client.updateOtherLoan(clientOtherLoanParams()).updated,
      "center",
      "success",
      "otherloan",
      "Edit Client Other Loan",
      "Client other loan has been updated successfully",
      true,
      3000
    );
  }
});

$(document).on("show.bs.modal", otherloanModal, function (e) {
  clearFields();
  let opener = e.relatedTarget;
  let actionType = $(opener).attr("data-action-type");

  if (actionType === "add") {
    $("#regOtherLoanTitle").text("Add Client Other Loan");
  } else if (actionType === "edit") {
    $("#regOtherLoanTitle").text("Edit Client Other Loan");
    $.each(opener.dataset, function (key, value) {
      $(otherloanModal).find(`[id = '${key}']`).val(value);

      if (key !== "busRegistered")
        $(businessModal).find(`[id = '${key}']`).val(value);
      else $(businessModal).find(`[id = '${key}']`).attr("checked", value);
    });
  }
});

$(document).on("show.bs.modal", "#modal-del-client-otherloan", function (e) {
  let opener = e.relatedTarget;
  $.each(opener.dataset, function (key, value) {
    $("#modal-del-client-otherloan").find(`[id = '${key}']`).val(value);
  });
});

$(document).on("click", "#delClientOtherLoanBtn", function (e) {
  let id = $("#delOtherLoanId").val();
  $.when(
    notification(
      client.delOtherLoan(id).deleted,
      "center",
      "success",
      "otherloan",
      "Delete Client Other Loan",
      "Client other loan has been deleted successfully",
      true,
      3000
    )
  ).done(function () {
    $("#modal-del-client-otherloan").modal("hide");
  });
});

//Params Methods ====================+++>
function clientAssetParams() {
  let id = $("#clientAssetId").val();
  let identifier = $("#identifier").val();
  let identifierType = $("#identifierType").val();
  let assetName = $("#assetName").val();
  let purchaseName = $("#purchaseName").val();
  let purchaseDate = $("#purchaseDate").val();
  let purchasePrice = $("#purchasePrice").val();
  let marketValue = $("#marketValue").val();
  let description = $("#assetDescription").val();

  let params = {
    id: id,
    client_id: currentDataset.recordId,
    identifier: identifier,
    identifier_type: identifierType,
    name: assetName,
    purchase_name: purchaseName,
    purchase_date: purchaseDate,
    purchase_price: purchasePrice,
    market_value: marketValue,
    description: description,
  };

  return params;
}

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

function clientOtherLoanParams() {
  let id = $("#clientOtherLoanId").val();
  let institution = $("#institution").val();
  let phoneNumber = $("#phoneNumber").val();
  let amount = $("#clientOtherLoan").find("[id = 'amount']").val();
  let period = $("#clientOtherLoan").find("[id = 'period']").val();
  let periodType = $("#periodType option:selected").val();
  let rate = $("#clientOtherLoan").find("[id = 'rate']").val();
  let loanedDate = $("#loanedDate").val();
  let amountPaid = $("#amountPaid").val();
  let purpose = $("#clientOtherLoan").find("[id = 'purpose']").val()
  let closed = $("#loanClosed").val();
  let stopped = $("#stopped").val();
  let reasonForStopping = $("#reasonForStopping").val();

  let params = {
    id: id,
    client_id: currentDataset.recordId,
    institution: institution,
    phone_number: phoneNumber,
    amount: amount,
    period: period,
    period_type: periodType,
    rate: rate,
    loaned_date: loanedDate,
    amount_paid: amountPaid,
    purpose: purpose,
    closed: closed,
    stopped: stopped,
    reason_for_stopping: reasonForStopping,
  };

  return params;
}

//FORMS AND CLIENT RECORDS METHODS
function loadForm(id, path) {
  $.when(loadContent(id, "contentRecord", path)).done(function () { });
}

function loadIndividualRecordView(path, state) {
  $.when(loadContent("mainContent", state, path)).done(function () { });
}

function loadRecord(path, state) {
  $.when(loadContent("mainContent", state, path)).done(function () { });
}
//========================>

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

function clearBusinessFileds() { }
