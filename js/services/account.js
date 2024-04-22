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
            { data: "deactivated" },
            { data: null },
        ],
        columnDefs: [
            {
                render: getDelButton,
                data: null,
                targets: [7],
            },
        ],
    });
}

function getDelButton(data, type, row, meta) {
    return `<button  type="button"  class="btn btn-danger"
        data-toggle="modal" data-target = "#modal-del-interest"
        data-del-interest-id = "${data.id}">
       <i class="fas fa-trash"></i></button>`;
  }
  