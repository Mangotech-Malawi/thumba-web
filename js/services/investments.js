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

export function addInvestmentPackage(params){
    return apiClient(
        "/api/v1/investiment_packag/add",
        "POST",
        "json",
        false,
        false,
        params
    )
}

export function editInvestmentPackage(params){
    return apiClient(
        "/api/v1/investiment_packag/edit",
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
            { data: null },
            { data: null },
            { data: null }
        ],
        columnDefs: [
            {
                render: getRequirementsBtn,
                data: null,
                targets: [10],
            },
            {
                render: getTermsAndConditionsBtn,
                data: null,
                targets: [11],
            },
            {
                render: getPayoutScheduleBtn,
                data: null,
                targets: [12],
            },

            {
                render: getEditInvestmentPackageBtn,
                data: null,
                targets: [13],
            },
            {
                render: getDelInvestmentPackageBtn,
                data: null,
                targets: [14],
            },
        ],
    });
}


function getRequirementsBtn(data, type, row, metas) {
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
        "fas fa-eye");
}


function getTermsAndConditionsBtn(data, type, row, metas) {
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

    return getButton(dataFields, "sell-collateral", "warning ",
        "fas fa-eye");
}

function getPayoutScheduleBtn(data, type, row, metas) {
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

    return getButton(dataFields, "sell-collateral", "success ",
        "fas fa-money-bill-alt");
}


function getEditInvestmentPackageBtn(data, type, row, metas) {
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

    return getButton(dataFields, "sell-collateral", "primary ",
        "fas fa-edit");
}


function getDelInvestmentPackageBtn(data, type, row, metas) {
    let dataFields = `data-id = "${data.id}"
                    data-action-type = "edit"`;

    return getButton(dataFields, "", "danger delete-collateral-sale", "fas fa-trash");
}


function getButton(dataFields, modal, color, icon) {
    return `<button type='button' class="btn btn-lgbtn-block btn-${color}" data-toggle="modal" 
              data-target="#modal-${modal}" ${dataFields} ><i class="${icon}" aria-hidden="true"></i></button>`;
}
