import { apiClient } from "./api-client.js";

let token = sessionStorage.getItem("token");

export function fetchClientsData() {
  let data = apiClient("/api/v1/clients", "GET", "json", false, false, {});
  if (data != null) {
    loadClientsTable(data);
  }
}

export function editClient(params){
  return apiClient("/api/v1/clients/update", "POST", "json", false, false, params);
}

export function addClient(params){
  return  apiClient("/api/v1/clients", "POST", "json", false, false, params);
}

export function delClient(id, void_reason){
  return apiClient("/api/v1/clients/delete", "POST", "json", false, 
                      false, {id: id, void_reason: void_reason});  
}

function loadClientsTable(dataSet) {
  $("#clientsTable").DataTable({
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
      { data: "national_id"},
      { data: "firstname" },
      { data: "lastname" },
      { data: "gender", defaultContent: "" },
      { data: "date_of_birth" },
      { data: "created_at" },
      { data: "spouse_id" },
      { data: null },
      { data: null },
      { data: null },
    ],
    columnDefs: [
      {
        targets: [7],
        visible: false,
        searchable: false,
      },
      {
        render: getEditButton,
        data: null,
        targets: [9],
      },
      {
        render: getViewButton,
        data: null,
        targets: [8],
      },
      {
        render: getDelButton,
        data: null,
        targets: [10],
      },
    ],
  });
}

function getEditButton(data, type, row, meta) {
  return `<button  type="button"  class="btn btn-default"
    data-toggle="modal" data-target = "#modal-register-client"
    data-user-id = "${data.id}"
    data-national-id  = "${data.national_id}" 
    data-firstname  = "${data.firstname}" 
    data-lastname = "${data.lastname}"
    data-gender = "${data.gender}"
    data-date-of-birth = "${data.date_of_birth}"
    data-house = "${data.house}"
    data-home-district ="${data.home_distsrict}"
    data-home-ta ="${data.home_ta}"
    data-home-village ="${data.home_village}"
    data-current-district ="${data.current_district}"
    data-current-ta ="${data.current_ta}"
    data-current-village ="${data.current_village}"
    data-nearest-landmark="${data.nearest_landmark}"
    data-spouse-id = "${data.spouse_id}"
    data-action-type = "edit">
   <i class="fas fa-edit"></i></button>`;
}

function getDelButton(data, type, row, meta) {
  return `<button  type="button"  class="btn btn-danger"
    data-toggle="modal" data-target = "#modal-del-client"
    data-id = "${data.id}">
   <i class="fas fa-trash"></i></button>`;
}

function getViewButton(data, type, row, meta) {
  return `<button  type="button"  class="btn btn-secondary"
    data-toggle="modal" data-target = "#modal-view-client"
    data-del-client-id = "${data.id}"
    data-firstname  = "${data.firstname}" 
    data-lastname = "${data.lastname}"
    data-gender = "${data.gender}"
    data-data-of-birth = "${data.date_of_birth}"
    data-house = "${data.house}"
    data-created-at = "${data.created_at}"
    data-spouse-id = "${data.spouse_id}">
   <i class="fas fa-eye"></i></button>`;
}


