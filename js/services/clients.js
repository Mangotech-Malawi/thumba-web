import { apiClient } from "./api-client.js";

let token = sessionStorage.getItem("token");

export function fetchClientsData() {
  let data = apiClient("/api/v1/clients", "GET", "json", false, false, {});
  if (data != null) {
      loadClientsTable(data);
  }
}

function loadClientsTable(dataSet) {
  let clientsTable = $("#clientsTable").DataTable({
    destroy: true,
    lengthChange: true,
    autoWidth: false,
    info: true,
    sDom: "lrtip",
    data: dataSet,
    columns: [
      { data: "id" },
      { data: "firstname" },
      { data: "lastname" },
      { data: "gender" },
      { data: "date_of_birth" },
      { data: "house" },
      { data: "occupation" },
      { data: "created_at" },
      { data: "spouse_id" },
      { data: null },
      { data: null },
      { data: null }
    ],
    columnDefs: [
      {
        targets: [8],
        visible: false,
        searchable: false,
      },
      {
        render: getEditButton,
        data: null,
        tagets: [9],
      },
      {
        render: getViewButton,
        data: null,
        tagets: [10],
      },
      {
        render: getDelButton,
        data: null,
        tagets: [11],
      },
    ]
  });
}

function getEditButton(data, type, row, meta) {}

function getDelButton(data, type, row, meta) {}

function getViewButton(data, type, row, meta) {}
