import { apiClient } from "./api-client.js";

export function fetchClientsData(state) {
  let data = apiClient("/api/v1/clients", "GET", "json", false, false, {});
  if (data != null) {
    if (state === "individual") loadIndividualsTable(data.individuals);
    else if (state === "organization")
      loadOrganizationsTable(data.organizations);
  }
}

export function editClient(params) {
  return apiClient(
    "/api/v1/clients/update",
    "POST",
    "json",
    false,
    false,
    params
  );
}

export function addClient(params) {
  return apiClient("/api/v1/clients", "POST", "json", false, false, params);
}

export function delClient(client_id, void_reason) {
  return apiClient("/api/v1/clients/delete", "POST", "json", false, false, {
    client_id: client_id,
    void_reason: void_reason,
  });
}

function loadIndividualsTable(dataSet) {
  $("#individualsTable").DataTable({
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
      { data: "national_id" },
      { data: "firstname" },
      { data: "lastname" },
      { data: "gender", defaultContent: "" },
      { data: "date_of_birth" },
      { data: null },
      { data: null },
      { data: null },
    ],
    columnDefs: [
      {
        render: getIndividualEditBtn,
        data: null,
        targets: [7],
      },
      {
        render: getIndividualViewBtn,
        data: null,
        targets: [6],
      },
      {
        render: getIndividualDelBtn,
        data: null,
        targets: [8],
      },
    ],
  });
}

function getIndividualEditBtn(data, type, row, meta) {
  let dataFields = `data-id = "${data.id}"
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
              data-action-type = "edit"
              data-client-type = "individual"`;

  return getButton(dataFields, "register-client", "default", "fas fa-edit");
}

function getIndividualDelBtn(data, type, row, meta) {
  return getButton(
    `data-id = "${data.id}" data-client-type = "individual"`,
    "del-client",
    "danger",
    "fa fa-trash"
  );
}

function getIndividualViewBtn(data, type, row, meta) {
  let dataFields = `data-del-client-id = "${data.id}"
                    data-firstname  = "${data.firstname}" 
                    data-lastname = "${data.lastname}"
                    data-gender = "${data.gender}"
                    data-data-of-birth = "${data.date_of_birth}"
                    data-house = "${data.house}"s
                    data-created-at = "${data.created_at}"
                    `;

  return getButton(dataFields, "view-client", "primary", "fa fa-eye");
}

function loadOrganizationsTable(dataSet) {
  $("#organizationsTable").DataTable({
    destroy: true,
    responsive: true,
    ordering: true,
    lengthChange: true,
    autoWidth: false,
    bfilter: false,
    info: true,
    data: dataSet,
    columns: [
      { data: "id" },
      { data: "name" },
      { data: "category", defaultContent: "" },
      { data: "email_address", defaultContent: "null" },
      { data: "phone_number" },
      { data: "registered" },
      { data: null },
      { data: null },
      { data: null },
    ],
    columnDefs: [
      {
        render: getOrgEditBtn,
        data: null,
        targets: [7],
      },
      {
        render: getOrgViewBtn,
        data: null,
        targets: [6],
      },
      {
        render: getOrgDelBtn,
        data: null,
        targets: [8],
      },
    ],
  });
}

function getOrgViewBtn(data, type, row, meta) {
  let dataFields = `data-id ="${data.id}"
                    data-org-name ="${data.name}" 
                    data-category="${data.category}"
                    data-purpose="${data.purpose}"
                    data-start-date="${data.start_date}"
                    data-email-address="${data.email_address}"
                    data-phone-number="${data.phone_number}"
                    data-office-location="${data.office_location}"
                    data-postal-address="${data.postal_address}"
                    data-registered="${data.registered}"`;

  return getButton(dataFields, "register-client", "primary", "fas fa-eye");
}

function getOrgEditBtn(data, type, row, meta) {
  let dataFields = `data-id ="${data.id}"
                    data-name ="${data.name}" 
                    data-category="${data.category}"
                    data-purpose="${data.purpose}"
                    data-start-date="${data.start_date}"
                    data-email-address="${data.email_address}"
                    data-phone-number="${data.phone_number}"
                    data-office-location="${data.office_location}"
                    data-postal-address="${data.postal_address}"
                    data-registered="${data.registered}"
                    data-action-type = "edit"
                    data-client-type = "organization"`;

  return getButton(dataFields, "register-client", "default", "fas fa-edit");
}

function getOrgDelBtn(data, type, row, metas) {
  return getButton(
    `data-id = "${data.id}" data-client-type = "organization"`,
    "del-client",
    "danger",
    "fa fa-trash"
  );
}

function getButton(dataFields, modal, color, icon) {
  return `<button type='button' class="btn btn-${color}" data-toggle="modal" 
          data-target="#modal-${modal}" ${dataFields} > <i class="${icon}" aria-hidden="true"s></i></button>`;
}
