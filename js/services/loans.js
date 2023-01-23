import { apiClient } from "./api-client.js";

export function fetchLoanApplications(params) {
  let data = apiClient(
    "/api/v1/applications",
    "GET",
    "json",
    false,
    false,
    params
  );

  if (params.status_name === "NEW")
    loadLoanApplications(data);
  else if (params.status_name === "WAITING")
    loadWaitingApplications(data);
  else if (params.status_name === "DONE")
    loadDoneApplications(data)
  else if (params.status_name === "DUMP")
    loadDumpedApplications(data)
}


export function fetchLoans() {
  let data = apiClient(
    "/api/v1/loans",
    "GET",
    "json",
    false,
    false,
    {}
  )

  loadLoans(data);
}

export function fetchLoanApplicationsStatuses(params) {
  let data = apiClient(
    "/api/v1/applications/statuses_stats",
    "GET",
    "json",
    false,
    false,
    params
  );

  return data;
}

export function addApplication(params) {
  return apiClient(
    "/api/v1/applications/new",
    "POST",
    "json",
    false,
    false,
    params
  );
}

export function updateApplication(params) {
  return apiClient(
    "/api/v1/applications/edit",
    "POST",
    "json",
    false,
    false,
    params
  );
}

export function addLoan(params) {
  return apiClient(
    "/api/v1/loans/new",
    "POST",
    "json",
    false,
    false,
    params
  );
}

function loadLoanApplications(dataset) {
  $("#newLoanApplicationsTable").DataTable({
    destroy: true,
    responsive: true,
    searching: true,
    ordering: true,
    lengthChange: true,
    autoWidth: false,
    info: true,
    data: dataset,
    columns: [
      { data: "id" },
      { data: "interest_name" },
      { data: null },
      { data: null },
      { data: "status_name" },
      { data: "amount" },
      { data: "rate" },
      { data: null },
      { data: null },
      { data: null },
      { data: null },
    ],
    columnDefs: [
      {
        render: getFirstname,
        data: null,
        targets: [2],
      },
      {
        render: getLastname,
        data: null,
        targets: [3],
      },

      {
        render: getGuarantorsBtn,
        data: null,
        targets: [7],
      },
      {
        render: getAnalyseRiskBtn,
        data: null,
        targets: [8],
      },
      {
        render: getApplicationUpdateBtn,
        data: null,
        targets: [9],
      },
      {
        render: getApplicationDelBtn,
        data: null,
        targets: [10],
      },
    ],
  });
}

function getFirstname(data, type, row, metas) {
  return data.borrower[0].firstname;
}

function getLastname(data, type, row, metas) {
  return data.borrower[0].lastname;
}

function getGuarantorsBtn(data, type, row, metas) {
  let dataFields = `data-loan-application-id = "${data.id}"
    data-firstname = "${data.borrower[0].firstname}"
    data-lastname = "${data.borrower[0].lastname}" 
    data-action-type = "gurantors"`;

  return getButton(dataFields, "guarantors", "success", "fas fa-users");
}

function getAnalyseRiskBtn(data, type, row, metas) {
  let dataFields = `data-loan-application-id = "${data.id}"
    data-collaterals = "${data.collaterals}" 
    data-action-type = "edit"`;

  return getButton(dataFields, "risk-calculator", "info", "fas fa-chart-bar");
}

function getApplicationUpdateBtn(data, type, row, metas) {
  let collaterals = JSON.stringify(data.collaterals);
  let dataFields = `data-id = "${data.id}"
                    data-loan-app-client-id = "${data.client_id}"
                    data-applicant-firstname = "${data.borrower[0].firstname}"
                    data-applicant-lastname = "${data.borrower[0].lastname}"
                    data-applicant-gender = "${data.borrower[0].gender}"
                    data-amount =  "${data.amount}"
                    data-purpose = "${data.purpose}"
                    data-collaterals = '${collaterals}'
                    data-action-type = "edit"`;

  return getButton(dataFields, "loan-application", "default", "fas fa-edit");
}

function getApplicationDelBtn(data, type, row, metas) {
  let dataFields = `data-loan-application-id = "${data.id}"
    data-action-type = "edit"`;
  return getButton(dataFields, "client-business", "danger", "fas fa-trash");
}

function loadWaitingApplications(dataset) {
  $("#waitingApplicationsTable").DataTable({
    destroy: true,
    responsive: true,
    searching: true,
    ordering: true,
    lengthChange: true,
    autoWidth: false,
    info: true,
    data: dataset,
    columns: [
      { data: "id" },
      { data: "interest_name" },
      { data: null },
      { data: null },
      { data: "amount" },
      { data: "rate" },
      { data: null },
      { data: null },
      { data: null },
      { data: null }
    ],
    columnDefs: [
      {
        render: getFirstname,
        data: null,
        targets: [2],
      },
      {
        render: getLastname,
        data: null,
        targets: [3],
      },
      {
        render: getGrade,
        data: null,
        targets: [6],
      },
      {
        render: getRisk,
        data: null,
        targets: [7],
      },
      {
        render: getApproveBtn,
        data: null,
        targets: [8],
      },
      {
        render: getDumpBtn,
        data: null,
        targets: [9],
      }
    ]
  });
}

function getGrade(data, type, row, metas) {
  return data.analysis.analysis[0].name;
}

function getRisk(data, type, row, metas) {
  return data.analysis.score_details.risk_percentage;
}

function getApproveBtn(data, type, row, metas) {
  let grade = data.analysis.analysis[0];
  let collaterals = JSON.stringify(data.collaterals);
  let dataFields = `data-loan-application-id = "${data.id}"
                    data-firstname = "${data.borrower[0].firstname}"
                    data-lastname = "${data.borrower[0].lastname}" 
                    data-gender = "${data.borrower[0].gender}"
                    data-amount =  "${data.amount}"
                    data-rate = "${data.rate}"
                    data-period = "${data.period}"
                    data-purpose = "${data.purpose}"
                    data-collaterals = '${collaterals}'
                    data-risk-percentage = "${data.analysis.score_details.risk_percentage}"
                    data-grade-name = "${grade.name}"
                    data-grade-range ="${grade.minimum} - ${grade.maximum}"
                    data-scores = '${JSON.stringify(data.analysis.score_details.scores)}'`;

  return getButton(dataFields, "approve", "success", "fas fa-users");
}

function getDumpBtn(data, type, row, metas) {
  let dataFields = `data-loan-application-id = "${data.id}"
  data-action-type = "edit"`;
  return getButton(dataFields, "dump", "danger", "fas fa-trash");
}


function loadDoneApplications(dataset) {
  $("#doneApplicationsTable").DataTable({
    destroy: true,
    responsive: true,
    searching: true,
    ordering: true,
    lengthChange: true,
    autoWidth: false,
    info: true,
    data: dataset,
    columns: [
      { data: "id" },
      { data: "interest_name" },
      { data: null },
      { data: null },
      { data: "amount" },
      { data: "rate" },
      { data: null },
      { data: null }
    ],
    columnDefs: [
      {
        render: getFirstname,
        data: null,
        targets: [2],
      },
      {
        render: getLastname,
        data: null,
        targets: [3],
      },
      {
        render: getGrade,
        data: null,
        targets: [6],
      },
      {
        render: getRisk,
        data: null,
        targets: [7],
      }
    ]
  });
}


function loadDumpedApplications(dataset) {
  $("#dumpedApplicationsTable").DataTable({
    destroy: true,
    responsive: true,
    searching: true,
    ordering: true,
    lengthChange: true,
    autoWidth: false,
    info: true,
    data: dataset,
    columns: [
      { data: "id" },
      { data: "interest_name" },
      { data: null },
      { data: null },
      { data: "amount" },
      { data: "rate" },
      { data: null },
      { data: null }
    ],
    columnDefs: [
      {
        render: getFirstname,
        data: null,
        targets: [2],
      },
      {
        render: getLastname,
        data: null,
        targets: [3],
      },
      {
        render: getGrade,
        data: null,
        targets: [6],
      },
      {
        render: getRisk,
        data: null,
        targets: [7],
      }
    ]
  });
}

function loadLoans(dataset) {
  $("#clientsLoansTable").DataTable({
    destroy: true,
    responsive: true,
    searching: true,
    ordering: true,
    lengthChange: true,
    autoWidth: false,
    info: true,
    data: dataset,
    columns: [
      { data: "loan_id" },
      { data: null },
      { data: null },
      { data: "rate" },
      { data: "amount" },
      { data: "payment" },
      { data: "profit" },
      { data: null },
      { data: null },
      { data: "loaned_date" },
      { data: "due_date" },
      { data: null }
    ],
    columnDefs: [
      {
        render: getFirstname,
        data: null,
        targets: [1],
      },
      {
        render: getLastname,
        data: null,
        targets: [2],
      },
      {
        render: getGrade,
        data: null,
        targets: [7],
      },
      {
        render: getRisk,
        data: null,
        targets: [8],
      },
      {
        render: getPayBtn,
        data: null,
        targets: [11],
      },
    ]
  });
}


function getPayBtn(data, type, row, metas) {
  let dataFields = `data-loan-application-id = "${data.loans_id}"
    data-action-type = "edit"`;

  return getButton(dataFields, "loan-payment", "success", "fas fa-handshake");
}





export function addGuarantor(params) {
  return apiClient(
    "/api/v1/applications/guarantor",
    "POST",
    "json",
    false,
    false,
    params
  );
}

export function fetchLoanGuarantors(params) {
  let data = apiClient(
    "/api/v1/applications/guarantors",
    "GET",
    "json",
    false,
    false,
    params
  );

  loadLoanGuarantors(data);
}

function loadLoanGuarantors(dataset) {
  $("#guarantorsTable").DataTable({
    destroy: true,
    responsive: true,
    searching: true,
    ordering: true,
    lengthChange: true,
    autoWidth: false,
    info: true,
    data: dataset,
    columns: [
      { data: "id" },
      { data: "national_id" },
      { data: "firstname" },
      { data: "lastname" },
      { data: "gender" },
      { data: "date_of_birth" },
      { data: "home_district" },
      { data: "home_ta" },
      { data: "home_village" },
      { data: "current_district" },
      { data: "current_ta" },
      { data: "current_village" },
      { data: "nearest_landmark" },
      { data: "relationship" },
      { data: null },
      { data: null },
    ],
    columnDefs: [
      {
        render: getGuarantorUpdateBtn,
        data: null,
        targets: [14],
      },
      {
        render: getGuarantorDelBtn,
        data: null,
        targets: [15],
      },
    ],
  });
}

function getGuarantorUpdateBtn(data, type, row, metas) {
  let dataFields = `data-loan-application-id = "${data.id}"
    data-action-type = "edit"`;

  return getButton(dataFields, "client-business", "default", "fas fa-edit");
}

function getGuarantorDelBtn(data, type, row, metas) {
  let dataFields = `data-loan-application-id = "${data.id}"
    data-action-type = "edit"`;
  return getButton(dataFields, "client-business", "danger", "fas fa-trash");
}

function getButton(dataFields, modal, color, icon) {
  return `<button type='button' class="btn btn-block btn-${color}" data-toggle="modal" 
            data-target="#modal-${modal}" ${dataFields} ><i class="${icon}" aria-hidden="true"></i></button>`;
}
