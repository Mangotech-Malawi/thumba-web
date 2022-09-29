import { apiClient } from "./api-client.js";

export function fetchLoanApplications() {
  let data = apiClient("/api/v1/applications", "GET", "json", false, false, {});

  if (data != null) {
    loadLoanApplications(data);
  }
}

function loadLoanApplications(dataset) {
  $("#loanApplicationsTable").DataTable({
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
        render: getPaymentsDetails,
        data: null,
        targets: [7],
      },
      {
        render: getCollateralsBtn,
        data: null,
        targets: [8],
      },
      {
        render: getGuarantorsBtn,
        data: null,
        targets: [9],
      },
      {
        render: getApplicationUpdateBtn,
        data: null,
        targets: [10],
      },
      {
        render: getApplicationDelBtn,
        data: null,
        targets: [11],
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

function getPaymentsDetails(data, type, row, metas) {
    let dataFields = `data-loan-application-id = "${data.id}"
    data-collaterals = "${data.collaterals}" 
    data-action-type = "edit"`;

  return getButton(dataFields, "client-business", "secondary", "fas fa-list");
}

function getCollateralsBtn(data, type, row, metas) {
  let dataFields = `data-loan-application-id = "${data.id}"
    data-collaterals = "${data.collaterals}" 
    data-action-type = "edit"`;

  return getButton(
    dataFields,
    "client-business",
    "info",
    "fas fa-hand-holding-usd"
  );
}

function getGuarantorsBtn(data, type, row, metas) {
  let dataFields = `data-loan-application-id = "${data.id}"
    data-collaterals = "${data.collaterals}" 
    data-action-type = "edit"`;

  return getButton(dataFields, "client-business", "success", "fas fa-users");
}

function getApplicationUpdateBtn(data, type, row, metas) {
  let dataFields = `data-loan-application-id = "${data.id}"

    data-action-type = "edit"`;

  return getButton(dataFields, "client-business", "default", "fas fa-edit");
}

function getApplicationDelBtn(data, type, row, metas) {
  let dataFields = `data-loan-application-id = "${data.id}"
    data-action-type = "edit"`;
  return getButton(dataFields, "client-business", "danger", "fas fa-trash");
}

function getButton(dataFields, modal, color, icon) {
  return `<button type='button' class="btn btn-${color}" data-toggle="modal" 
            data-target="#modal-${modal}" ${dataFields} ><i class="${icon}" aria-hidden="true"></i></button>`;
}
