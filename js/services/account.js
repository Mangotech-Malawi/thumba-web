import { apiClient } from "./api-client.js";

export function register(params) {
    return apiClient("/api/v1/account/new", "POST", "json", false, false, params);
}

export function fetchAccounts() {
    let data = apiClient("/api/v1/accounts", "GET", "json", false, false, {});

    if (data != null) {
        populateAccountsTable(data);
    }

    return data;
}

export function uploadLogo(account_id, imageFile) {
    const formData = new FormData();
    formData.append("account[logo]", imageFile); // Rails param for the image
    formData.append("account[account_id]", account_id);

    return apiClient(
        `/api/v1/account/upload_logo`,
        "POST",
        null,
        false, // Synchronous
        false,
        formData,
        true // isFile
    );
}

export function changeAccountStatus(params) {
    return apiClient("/api/v1/account/change_status", "POST", "json", false, false, params);
}

function populateAccountsTable(dataset) {
    $("#accountsTable").DataTable({
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
            { data: "name" },
            { data: "address" },
            { data: "email" },
            { data: "phone_number" },
            { data: "created_at" },
            { data: null },
            { data: null },
        ],
        columnDefs: [
            {
                render: getSwitchButton,
                data: null,
                targets: [6],
            }
            ,
            {
                render: getDelButton,
                data: null,
                targets: [7],
            },
        ],
    });
}

function getSwitchButton(data, type, row, meta) {
    if (data.deactivated)
        return `<div class="icheck-primary d-inline">
                    <input class="account-status" type="checkbox" id="${data.id}"
                    data-id="${data.id}" data-active = "false" >
                    <label class="text-danger" for="${data.id}">
                        Inactive
                    </label>
                </div>`
    else
        return `<div class="icheck-primary d-inline ">
                    <input class="account-status" type="checkbox" id="${data.id}" 
                    data-id="${data.id}" data-active = "true" checked>
                    <label class="text-success" for="${data.id}">
                     Active
                    </label>
                </div>`

}


function getDelButton(data, type, row, meta) {
    return `<button  type="button"  class="btn btn-danger"
        data-toggle="modal" data-target = "#modal-del-interest"
        data-del-interest-id = "${data.id}">
       <i class="fas fa-trash"></i></button>`;
}
