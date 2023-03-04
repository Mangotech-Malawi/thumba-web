import { apiClient } from "./api-client.js";

export function fetchInvestimentPackages() {
    let data = apiClient(
        "/api/v1/investiment_packages",
        "GET",
        "json",
        false,
        false,
        {}
    )

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
    let dataFields = `data-collateral-sale-id = "${data.id}"
                      data-identifier = "${data.identifier}"
                      data-sold-date = "${data.sold_date}"
                      data-collateral-sale-modal-title = "Edit Collateral Sale"`;

    return getButton(dataFields, "sell-collateral", "primary ",
        "fas fa-edit");
}

function getDelInvestmentBtn(data, type, row, metas) {
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

    return getButton(dataFields, "sell-collateral", "danger ",
        "fas fa-trash")
}


function getButton(dataFields, modal, color, icon) {
    return `<button type='button' class="btn btn-lgbtn-block btn-${color}" data-toggle="modal" 
              data-target="#modal-${modal}" ${dataFields} ><i class="${icon}" aria-hidden="true"></i></button>`;
}
