import { apiClient } from "./api-client.js";

export function fetchInvestimentPackages(...args) {
    let data = apiClient(
        "/api/v1/investiment_packages",
        "GET",
        "json",
        false,
        false,
        {}
    )

    if (args[0] === "load-none")
         return data  
    else 
        populateInvestmentPackagesTable(data);
}

export function addInvestmentPackage(params) {
    return apiClient(
        "/api/v1/investiment_package/add",
        "POST",
        "json",
        false,
        false,
        params
    )
}

export function editInvestmentPackage(params) {
    return apiClient(
        "/api/v1/investiment_package/edit",
        "POST",
        "json",
        false,
        false,
        params
    )
}

export function deleteInvestmentPackage(params) {
    return apiClient(
        "/api/v1/investiment_package/delete",
        "POST",
        "json",
        false,
        false,
        params
    )
}

function populateInvestmentPackagesTable(dataSet) {
    $("#investmentPackagesTable").DataTable({
        destroy: true,
        responsive: true,
        searching: true,
        ordering: true,
        lengthChange: true,
        autoWidth: false,
        info: true,
        data: dataSet,
        columns: [
            { data: "id" },
            { data: "package_name" },
            { data: "package_type" },
            { data: "min_amount" },
            { data: "max_amount" },
            { data: "interest_rate" },
            { data: "interest_frequency" },
            { data: "duration" },
            { data: "currency" },
            { data: "risk_level" },
            { data: null },
            { data: null },
            { data: null }
        ],
        columnDefs: [
            {
                render: getMoreBtn,
                data: null,
                targets: [10],
            },
            {
                render: getEditInvestmentPackageBtn,
                data: null,
                targets: [11],
            },
            {
                render: getDelInvestmentPackageBtn,
                data: null,
                targets: [12],
            },
        ],
    });
}


function getMoreBtn(data, type, row, metas) {
    let dataFields = `data-investment-package-id = "${data.id}"
                      data-package-name = "${data.package_name}"
                      data-min-amount = "${data.min_amount}"
                      data-max-amount = "${data.max_amount}"
                      data-interest-rate = "${data.interest_rate}"
                      data-interest-frequency = "${data.market_value}"
                      data-duration = "${data.duration}"
                      data-currency = "${data.currency}"
                      data-risk-level = "${data.risk_level}"
                      data-requirements = "${data.requirements}"
                      data-terms-and-conditions = "${data.term_and_conditions}"
                      data-payout-schedule = "${data.payout_schedule}"
                      data-inves = "Edit Collateral Sale"`;

    return getButton(dataFields, "sell-collateral", "warning ",
        "fas fa-list");
}


function getEditInvestmentPackageBtn(data, type, row, metas) {
    let dataFields = `data-investment-package-id = "${data.id}"
                      data-package-name = "${data.package_name}"
                      data-package-type = "${data.package_type}"
                      data-min-amount = "${data.min_amount}"
                      data-max-amount = "${data.max_amount}"
                      data-interest-rate = "${data.interest_rate}"
                      data-interest-frequency = "${data.market_value}"
                      data-duration = "${data.duration}"
                      data-currency = "${data.currency}"
                      data-risk-level = "${data.risk_level}"
                      data-requirements = "${data.requirements}"
                      data-terms-and-conditions = "${data.term_and_conditions}"
                      data-payout-schedule = "${data.payout_schedule}"
                      data-action-type = "edit"`;

    return getButton(dataFields, "investiment-package", "primary ", "fas fa-edit");
}


function getDelInvestmentPackageBtn(data, type, row, metas) {
    let dataFields = `data-id = "${data.id}"
                      data-action-type = "edit"`;

    return getButton(dataFields, "", "danger delete-investment-package", "fas fa-trash");
}


export function fetchInvestments() {
    let data = apiClient(
        "/api/v1/investiments",
        "GET",
        "json",
        false,
        false,
        {}
    )

    populateInvestmentsTable(data);
}


export function addInvestment(params) {
    return apiClient(
        "/api/v1/investiment/new",
        "POST",
        "json",
        false,
        false,
        params
    )
}


export function editInvestment(params) {
    return apiClient(
        "/api/v1/investiment/edit",
        "POST",
        "json",
        false,
        false,
        params
    )
}


export function deleteInvestment(params) {
    return apiClient(
        "/api/v1/investiment/delete",
        "POST",
        "json",
        false,
        false,
        params
    )
}

function populateInvestmentsTable(dataSet) {
    $("#investmentsTable").DataTable({
        destroy: true,
        responsive: true,
        searching: true,
        ordering: true,
        lengthChange: true,
        autoWidth: false,
        info: true,
        data: dataSet,
        columns: [
            { data: "id" },
            { data: "firstname" },
            { data: "lastname" },
            { data: "package_name" },
            { data: "amount" },
            { data: "investment_date" },
            { data: null },
            { data: null }
        ],
        columnDefs: [
            {
                render: getEditInvestmentBtn,
                data: null,
                targets: [6],
            },
            {
                render: getDelInvestmentBtn,
                data: null,
                targets: [7],
            }
        ],
    });
}

function getEditInvestmentBtn(data, type, row, metas) {
    let dataFields = `data-investment-id = "${data.id}"
                      data-investor-id = "${data.user_id}"
                      data-investment-package-id = "${data.investiment_package_id}"
                      data-amount = "${data.amount}"
                      data-description = "${data.description}"
                      data-investment-date = "${data.investment_date}"
                      data-action-type = "edit"`;

    return getButton(dataFields, "investment", "primary ",
        "fas fa-edit");
}

function getDelInvestmentBtn(data, type, row, metas) {
    let dataFields = `data-id = "${data.id}"
                      data-action-type = "edit"`;

    return getButton(dataFields, "", "danger  delete-investment ",
        "fas fa-trash")
}

export function fetchReturnsOnInvestments(params) {

    let data = apiClient(
        "/api/v1/return_on_investments",
        "GET",
        "json",
        false,
        false,
        {}
    )

    populateReturnsOnInvestmentsTable(data);
}

function populateReturnsOnInvestmentsTable(dataSet) {
    $("#returnOnInvestmentsTable").DataTable({
        destroy: true,
        responsive: true,
        searching: true,
        ordering: true,
        lengthChange: true,
        autoWidth: false,
        info: true,
        data: dataSet,
        columns: [
            { data: "firstname" },
            { data: "lastname" },
            { data: "package_name" },
            { data: "interest_rate" },
            { data: "amount" },
            { data: "roi" }
          
        ],
        columnDefs: [
        ],
    });
}




function getButton(dataFields, modal, color, icon) {
    return `<button type='button' class="btn btn-block btn-${color}" data-toggle="modal" 
              data-target="#modal-${modal}" ${dataFields} ><i class="${icon}" aria-hidden="true"></i></button>`;
}
