import { apiClient } from "./api-client.js";

// Share Classes 
export function fetchShareClasses(params) {
    const data = apiClient("/api/v1/share_classes",
        "GET",
        "json",
        false,
        false,
        params)

    loadShareClasses(data)

    return data;
}

export function loadShareClasses(dataset) {
    $("#shareClassesTable").DataTable({
        destroy: true,
        responsive: true,
        searching: true,
        ordering: true,
        lengthChange: true,
        autoWidth: false,
        info: true,
        data: dataset,
        columns: [
            { data: "name" },
            { data: "code" },
            { data: "price_per_share" },
            { data: "description" },
            { data: null },
            { data: null }
        ],

        columnDefs: [
            {

                render: getEditShareClassBtn,
                data: null,
                targets: [4],
            },
            {
                render: getDeleteShareClassBtn,
                data: null,
                targets: [5],
            }
        ],
    });
}


function getEditShareClassBtn(data, type, row, metas) {
    let dataFields = `data-share-class-id = "${data.id}"
                      data-name = "${data.name}"
                      data-code = "${data.code}"
                      data-price-per-share = "${data.price_per_share}"
                      data-description = "${data.market_value}"
                      data-share-class-modal-title = "Edit Share Class"`;

    return getButton(dataFields, "share-class", "default edit-share-class",
        "fas fa-money-bill-alt");
}

function getDeleteShareClassBtn(data, type, row, metas) {
    let dataFields = `data-id = "${data.id}"
                    data-action-type = "edit"`;

    return getButton(dataFields, "", "danger del-share-class", "fas fa-trash");
}


// Shareholders
export function addShareholder(params) {
  return apiClient("/api/v1/shareholder", "POST", "json", false, false, params);
}

export function fetchShareholders(params) {
    const data = apiClient("/api/v1/shareholders",
        "GET",
        "json",
        false,
        false,
        params)

    loadShareholders(data)
}

export function loadShareholders(dataset) {

    $("#shareholdersTable").DataTable({
        destroy: true,
        responsive: true,
        searching: true,
        ordering: true,
        lengthChange: true,
        autoWidth: false,
        info: true,
        data: dataset,
        columns: [
            { data: "identifier" },
            { data: "firstname" },
            { data: "lastname" },
            { data: "gender" },
            { data: null },
            { data: null }
        ],

        columnDefs: [
            {
                render: getContributionBtn,
                data: null,
                targets: [4],
            },
            {

                render: getEditShareholderBtn,
                data: null,
                targets: [5],
            },
            {
                render: getDeleteShareholderBtn,
                data: null,
                targets: [6],
            }
        ],
    });
}

function getContributionBtn(data, type, row, metas) {
    let dataFields = `data-shareholder-id = "${data.shareholder_id}"
                      data-share-class-modal-title = "Edit Share Class"`;

    return getButton(dataFields, "capital-contribution", "default edit-shareholder",
        "fas fa-money-bill-alt")
}

function getEditShareholderBtn(data, type, row, metas) {
    let dataFields = `data-shareholder-id = "${data.shareholder_id}"
                      data-firstname = "${data.firstname}"
                      data-lastname = "${data.lastname}"
                      data-gender = "${data.gender}"
                      data-share-class-modal-title = "Edit Share Class"`;

    return getButton(dataFields, "", "default edit-shareholder",
        "fas fa-edit");
}

function getDeleteShareholderBtn(data, type, row, metas) {
    let dataFields = `data-id = "${data.shareholder_id}"
                    data-action-type = "edit"`;

    return getButton(dataFields, "", "danger del-shareholder", "fas fa-trash");
}


// Capital Contributions

export function addCapitalContribution(params) {
  return apiClient("/api/v1/capital_contribution", "POST", "json", false, false, params);
}

export function fetchCapitalContributions(params) {
    const data = apiClient("/api/v1/capital_contributions",
        "GET",
        "json",
        false,
        false,
        params)

    loadCapitalContributions(data)
}

export function loadCapitalContributions(dataset) {

    $("#capitalContributionsTable").DataTable({
        destroy: true,
        responsive: true,
        searching: true,
        ordering: true,
        lengthChange: true,
        autoWidth: false,
        info: true,
        data: dataset,
        columns: [
            { data: "identifier" },
            { data: "firstname" },
            { data: "lastname" },
            { data: "gender" },
            { data: "name" },
            { data: "code" },
            { data: "price_per_share" },
            { data: "amount" },
            { data: "status" },
            { data: null },
            { data: null }
        ],

        columnDefs: [
            {

                render: getEditCapitalContributionBtn,
                data: null,
                targets: [9],
            },
            {
                render: getDeleteCapitalContributionBtn,
                data: null,
                targets: [10],
            }
        ],
    });
}

function getEditCapitalContributionBtn(data, type, row, metas) {
    let dataFields = `data-capital-contribution-id = "${data.id}"
                      data-amount = "${data.amount}"
                      data-share-class-modal-title = "Edit Capital Contribution"`;

    return getButton(dataFields, "capital-contribution", "default edit-capital-contribution",
        "fas fa-money-bill-alt");
}

function getDeleteCapitalContributionBtn(data, type, row, metas) {
    let dataFields = `data-id = "${data.id}"
                    data-action-type = "edit"`;

    return getButton(dataFields, "", "danger del-shareholder", "fas fa-trash");
}

// Shares 

export function fetchShares(params) {
    const data = apiClient("/api/v1/shares",
        "GET",
        "json",
        false,
        false,
        params)

    loadShares(data)
}

export function loadShares(dataset) {
    $("#sharesTable").DataTable({
        destroy: true,
        responsive: true,
        searching: true,
        ordering: true,
        lengthChange: true,
        autoWidth: false,
        info: true,
        data: dataset,
        columns: [
            { data: "identifier" },
            { data: "firstname" },
            { data: "lastname" },
            { data: "gender" },
            { data: "name" },
            { data: "quantity" }
        ]
    });
}

// Reusable button 

function getButton(dataFields, modal, color, icon) {
    return `<button type='button' class="btn btn-block btn-${color}" data-toggle="modal" 
            data-target="#modal-${modal}" ${dataFields} ><i class="${icon}" aria-hidden="true"></i></button>`;
}