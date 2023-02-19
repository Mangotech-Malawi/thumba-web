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

export function addLoanPayment(params) {
  return apiClient(
    "/api/v1/loans/add_payment",
    "POST",
    "json",
    false,
    false,
    params
  );
}

export function updateLoanPayment(params) {
  return apiClient(
    "/api/v1/loans/edit_payment",
    "POST",
    "json",
    false,
    false,
    params
  );
}


export function deletePayment(params){  
  return apiClient(
    "/api/v1/loan/payment/delete",
    "POST",
    "json",
    false,
    false,
    params
  );

}

export function fetchLoanPayments(params) {
  let data = apiClient(
    "/api/v1/loan/payments",
    "GET",
    "json",
    false,
    false,
    params
  );

  populatePaymentsTable(data)
}

export function addCollateralSeizure(params){
  return apiClient(
    "/api/v1/collateral_seizure",
    "POST",
    "json",
    false,
    false,
    params
  );
}

export function removeCollateralSeizure(params){
  return apiClient(
    "/api/v1/collateral_seizure/edit",
    "POST",
    "json",
    false,
    false,
    params
  );
}

export function sellCollateral(params){
  return apiClient(
    "/api/v1/collateral_sale/new",
    "POST",
    "json",
    false,
    false,
    params
  );
}

export function fetchCollateralSeizures(){
  let data = apiClient(
    "/api/v1/collateral_seizures",
    "GET",
    "json",
    false,
    false,
    {}
  );

  populateSeizedCollateralsTable(data);
}

export function fetchCollateralSales(){
  let data = apiClient(
    "/api/v1/collateral_sales",
    "GET",
    "json",
    false,
    false,
    {}
  );

  populateCollateralSalesTable(data); 
}

export function editCollateralSale(params){
  return apiClient(
    "/api/v1/collateral_sale/edit",
    "POST",
    "json",
    false,
    false,
    params
  ); 
}

export function deleteCollateralSale(params){
  return apiClient(
    "/api/v1/collateral_sale/delete",
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
      { data: null },
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
      {
        render: getSeizeCollaterBtn,
        data: null,
        targets: [12]
      }
    ]
  });
}

function getPayBtn(data, type, row, metas) {
  let dataFields = `data-loan-id = "${data.loan_id}"
                    data-firstname = "${data.borrower[0].firstname}"
                    data-lastname = "${data.borrower[0].lastname}"`;

  return getButton(dataFields, "loan-payments", "secondary", "fas fa-handshake");
}

function  getSeizeCollaterBtn(data, type, row, metas){
  let collaterals = JSON.stringify(data.collaterals);
  let dataFields = `data-loan-id = "${data.loan_id}"
                    data-collaterals = '${collaterals}'
                    data-firstname = "${data.borrower[0].firstname}"
                    data-lastname = "${data.borrower[0].lastname}"
                    `;

  return getButton(dataFields, "seized-collateral", "warning", "fas fa-building");
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


function populatePaymentsTable(dataset) {
  $("#loanPaymentsTable").DataTable({
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
      { data: "paid_amount" },
      { data: "total_paid" },
      { data: "balance" },
      { data: "payment_date"},
      { data: null },
      { data: null },
    ],
    columnDefs: [
      {
        render: getPaymentUpdateBtn,
        data: null,
        targets: [5],
      },
      {
        render: getPaymentDelBtn,
        data: null,
        targets: [6],
      },
    ],
  });
}

function getPaymentUpdateBtn(data, type, row, metas) {
  let dataFields = `data-loan-application-id = "${data.id}"
    data-action-type = "edit"`;

  return getButton(dataFields, "", "default edit-loan-payment", "fas fa-edit");
}

function getPaymentDelBtn(data, type, row, metas) {
  let dataFields = `data-loan-application-id = "${data.id}"
    data-action-type = "edit"`;
  return getButton(dataFields, "", "danger delete-loan-payment", "fas fa-trash");
}


function populateSeizedCollateralsTable(dataset) {
  $("#seizedCollateralsTable").DataTable({
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
      { data: "identifier" },
      { data: "identifier_type" },
      { data: "name" },
      { data: "purchase_date"},
      { data: "purchase_price"},
      { data: "market_value"},
      { data: "seized_date"},
      { data: null },
      { data: null },
    ],
    columnDefs: [
      {
        render: getSellBtn,
        data: null,
        targets: [8],
      },
      {
        render: getReturnBtn,
        data: null,
        targets: [9],
      },
    ],
  });
}

function getSellBtn(data, type, row, metas) {
  let dataFields = `data-seizure-id = "${data.id}"
                    data-identifier = "${data.identifier}"
                    data-name = "${data.name}"
                    data-identifier-type = "${data.identifier_type}"
                    data-purchase-date = "${data.purchase_date}"
                    data-purchase-price = "${data.purchase_price}"
                    data-market-value = "${data.market_value}"
                    data-seized-date = "${data.seized_date}"
                    data-collateral-sale-modal-title = "Add Collateral Sale"`;

  return getButton(dataFields, "sell-collateral", "default ", "fas fa-money-bill-alt");
}

function getReturnBtn(data, type, row, metas) {
  let dataFields = `data-id = "${data.id}"
                    data-collateral-id = "${data.collateral_id}"
                    data-collateral-sale-modal-title = "Add Collateral Sale"`;

  return getButton(dataFields, "", "secondary return-collateral", "fas fa-handshake");
}



function populateCollateralSalesTable(dataset) {
  $("#collateralSalesTable").DataTable({
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
      { data: "identifier" },
      { data: "identifier_type" },
      { data: "name" },
      { data: "purchase_price"},
      { data: "market_value"},
      { data: "sold_price"},  
      { data: "sold_date"},
      { data: "seized_date"},
      { data: null },
      { data: null },
    ],
    columnDefs: [
      {
        render: getEditCollateralSaleBtn,
        data: null,
        targets: [9],
      },
      {
        render: getDeleteCollateralSaleBtn,
        data: null,
        targets: [10],
      },
    ],
  });
}

function getEditCollateralSaleBtn(data, type, row, metas) {
  let dataFields = `data-collateral-sale-id = "${data.id}"
                    data-identifier = "${data.identifier}"
                    data-name = "${data.name}"
                    data-identifier-type = "${data.identifier_type}"
                    data-purchase-price = "${data.purchase_price}"
                    data-market-value = "${data.market_value}"
                    data-seized-date = "${data.seized_date}"
                    data-selling-price = "${data.sold_price}"
                    data-sold-date = "${data.sold_date}"
                    data-collateral-sale-modal-title = "Edit Collateral Sale"`;

  return getButton(dataFields, "sell-collateral", "default ", 
                          "fas fa-money-bill-alt");
}

function getDeleteCollateralSaleBtn(data, type, row, metas) {
  let dataFields = `data-id = "${data.id}"
                    data-action-type = "edit"`;

  return getButton(dataFields, "", "danger delete-collateral-sale", "fas fa-trash");
}



function getButton(dataFields, modal, color, icon) {
  return `<button type='button' class="btn btn-block btn-${color}" data-toggle="modal" 
            data-target="#modal-${modal}" ${dataFields} ><i class="${icon}" aria-hidden="true"></i></button>`;
}
