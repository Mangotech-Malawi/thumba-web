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

export function addJob(params){
  return apiClient("/api/v1/client_job", "POST", "json", false, false, params);
}

export function updateJob(params){
  return apiClient("/api/v1/client_job/update", "POST", "json", false, false, params);
}

export function delJob(client_job_id) {
  return apiClient("/api/v1/client_job/delete", "POST", "json", false, false, {
    id: client_job_id
  });
}


export function fetchClientJobs(params){
  let data = apiClient("/api/v1/client_job", "GET", "json", false, false, 
    params
  );

  if(data != null ){
    loadClientJobs(data);
  }

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
        render: getIndividualViewBtn,
        data: null,
        targets: [6],
      },
      {
        render: getIndividualEditBtn,
        data: null,
        targets: [7],
      },
      {
        render: getIndividualDelBtn,
        data: null,
        targets: [8],
      },
    ],
  });
}

function getIndividualViewBtn(data, type, row, meta) {
  let dataFields = `data-record-id = "${data.id}"
                    data-record-national-id  = "${data.national_id}" 
                    data-record-firstname  = "${data.firstname}" 
                    data-record-lastname = "${data.lastname}"
                    data-record-gender = "${data.gender}"
                    data-record-date-of-birth = "${data.date_of_birth}"
                    data-record-home-district ="${data.home_district}"
                    data-record-home-ta ="${data.home_ta}"
                    data-record-home-village ="${data.home_village}"
                    data-record-current-district ="${data.current_district}"
                    data-record-current-ta ="${data.current_ta}"
                    data-record-current-village ="${data.current_village}"
                    data-record-nearest-landmark="${data.nearest_landmark}"
                    data-record-created-at = "${data.created_at}"
                    data-client-type = "individual"`;

  return `<button type='button' class="btn btn-primary recordBtn" 
       ${dataFields} > <i class="fas fa-file" aria-hidden="true"></i></button>`;
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

  return getButton(dataFields, "register-client", "default", "fas fa-edit ");
}

function getIndividualDelBtn(data, type, row, meta) {
  return getButton(
    `data-id = "${data.id}" data-client-type = "individual"`,
    "del-client",
    "danger",
    "fa fa-trash"
  );
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



//Clients Jobs Code
function loadClientJobs(dataset){
  $("#jobsTable").DataTable({
    destroy: true,
    responsive: true,
    searching: true,
    ordering: true,
    lengthChange: true,
    autoWidth: false,
    info: true,
    data: dataset,
    columns: [
      { data: "client_job_id" },
      { data: "title" },
      { data: "department" },
      { data: "employer_type" },
      { data: "employer_name" },
      { data: "employment_type" },
      { data: "date_started" },
      { data: "contract_due" },
      { data: "net_salary"},
      { data: "gross_salary"},
      { data: "pay_date"},
      { data: "postal_address"},
      { data: "email_address"},
      { data: "phone_number"},
      { data: "district"},
      { data: null },
      { data: null },
    ],
    columnDefs: [
      {
        render: getJobEditBtn,
        data: null,
        targets: [15],
      },
      {
        render: getJobDelBtn,
        data: null,
        targets: [16],
      },
    ],
  });
}

function getJobEditBtn(data, type, row, metas){

  let dataFields = `data-client-job-id = "${data.client_job_id}"
    data-title = "${data.title}" 
    data-department  = "${data.department}" 
    data-employer-type = "${data.employer_type}"
    data-employer-name = "${data.employer_name}"
    data-employment-type = "${data.employment_type}"
    data-date-started = "${data.date_started}"
    data-contract-due ="${data.contract_due}"
    data-net-salary ="${data.net_salary}"
    data-gross-salary ="${data.gross_salary}"
    data-pay-date ="${data.pay_date}"
    data-postal-address ="${data.postal_address}"
    data-email-address ="${data.email_address}"
    data-phone-number="${data.phone_number}"
    data-spouse-id = "${data.district}"
    data-action-type = "edit"`;
   
  return getButton(dataFields, "client-job", "default", "fas fa-edit");
}

function getJobDelBtn(data, type, row, metas){
  return getButton(
    `data-del-client-job-id = "${data.client_job_id}" `,
    "del-client-job",
    "danger",
    "fa fa-trash"
  );
}


function getButton(dataFields, modal, color, icon) {
  return `<button type='button' class="btn btn-${color}" data-toggle="modal" 
          data-target="#modal-${modal}" ${dataFields} ><i class="${icon}" aria-hidden="true"></i></button>`;
}






