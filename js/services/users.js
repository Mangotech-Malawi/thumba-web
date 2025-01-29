import * as validator from "./validator.js";
import { apiClient } from "./api-client.js";

let token = sessionStorage.getItem("token");

//Keeping identifier types in localstorage because they seldom change
let identifier_types = JSON.parse(sessionStorage.getItem("identifier_types"));

if ( typeof identifier_types == undefined || identifier_types === null 
    || identifier_types === ''){
    $.when(getIdentifierTypes()).done(function(data){
        sessionStorage.setItem("identifier_types", JSON.stringify(data));
        loadIdentifierTypes();
    });
}else{
  loadIdentifierTypes();
}

export function add(params) {
  return apiClient("/api/v1/new_user", "POST", "json", false, false, params);
}

export function edit(params) {

  return apiClient(
    "/api/v1/edit_user",
    "POST",
    "json",
    false,
    false,
    params
  );
}

export function login(params) {
  $.when(
    apiClient("/api/v1/auth/login", "POST", "json", false, false, params)
  ).done(function (data) {
    if (data != null) {

      $.when(saveSessionDetails(data)).done(
        function () {
          window.location = "thumba.html";
      });
      
    } else {
      //Display an error here
      $("#invalidCredentials").text("Invalid Credentials");
    }
  });
}

export function inviter(params){
  return apiClient("/api/v1//invitations/new",
        "POST", "json", false, false, params);
}

export function register(params){
  return apiClient("/api/v1/invitations/register",
    "POST", "json", false, false, params);
}

export function verifyCurPasword(params) {
  return apiClient("/api/v1/verify_password",
    "POST", "json", false, false,
    params);
}

export function updateProfile(params) {
  return apiClient("/api/v1/update_profile",
    "POST", "json", false, false,
    params);
}

export function delete_user(params) {
  return apiClient("/api/v1/delete_user", "POST", "json", false, false,
    params,
  );
}

export function sendOTP(params) {
  return apiClient("/api/v1/auth/send_otp", "POST", "json", false, false,
    params
  );
}

export function verifyOTP(params) {
  return apiClient("/api/v1/auth/verify_otp", "POST", "json", false, false,
    params
  );
}

function getIdentifierTypes(){
  return apiClient("/api/v1/identifier_types", "GET", "json", false, false, {});
}

export function fetchUsers() {

  let data = apiClient("/api/v1/users", "GET", "json", false, false, {});

  if (data != null) {
    loadUsersTable(data);
  }

  return data;
}

function loadUsersTable(dataset) {
  $("#usersTable").DataTable({
    destroy: true,
    responsive: true,
    ordering: true,
    lengthChange: true,
    autoWidth: false,
    bfilter: false,
    info: true,
    data: dataset,
    columns: [
      { data: "id" },
      { data: "identifier" },
      { data: "username" },
      { data: "firstname" },
      { data: "lastname" },
      { data: "email" },
      { data: "role" },
      { data: null },
      { data: null },
    ],
    columnDefs: [
      {
        render: getEditButton,
        data: null,
        targets: [7],
      },
      {
        render: getDelButton,
        data: null,
        targets: [8],
      },
    ],
  });
}

function getDelButton(data, type, row, meta) {
  return `<button  type="button"  class="btn btn-block btn-danger"
    data-toggle="modal" data-target = "#modal-delete-user"
    data-id = "${data.id}"
    data-username = "${data.username}">
   <i class="fas fa-trash"></i></button>`;
}

function getEditButton(data, type, row, meta) {
  return `<button  type="button"  class="btn btn-block btn-default"
    data-toggle="modal" data-target = "#modal-register-user"
    data-user-id = "${data.id}"
    data-national-id = "${data.identifier}"
    data-username = "${data.username}"
    data-firstname = "${data.firstname}"
    data-lastname = "${data.lastname}"
    data-email = "${data.email}"
    data-role = "${data.role}"
    data-button-type = "edit">
   <i class="fas fa-edit"></i></button>`;
}

export function fetchInvitations() {

  let data = apiClient("/api/v1/invitations", "GET", "json", false, false, {});

  if (data != null) {
    loadInvitationsTable(data);
  }

  return data;
}

function loadInvitationsTable(dataset){
  $("#pendingInvitesTable").DataTable({
    destroy: true,
    responsive: true,
    ordering: true,
    lengthChange: true,
    autoWidth: false,
    bfilter: false,
    info: true,
    data: dataset,
    columns: [
      { data: "email" },
      { data: "role" },
      { data: "accepted" },
      { data: "expires_at" },
      { data: "created_at" },
      { data: null },
      { data: null },
    ],
    columnDefs: [
      {
        render: getResendInvitationButton,
        data: null,
        targets: [5],
      },
      {
        render: getDelInvitationButton,
        data: null,
        targets: [6],
      },
    ],
  });
}

function getResendInvitationButton(data, type, row, meta) {
  return `<button  type="button"  class="btn btn-block btn-primary"
    data-toggle="modal" data-target = "#modal-delete-user"
    data-id = "${data.id}"
    data-role = "${data.role}"
    data-email = "${data.email}">
   <i class="fas fa-envelope"></i> Resend</button>`;
}

function getDelInvitationButton(data, type, row, meta) {
  return `<button  type="button"  class="btn btn-block btn-danger"
    data-toggle="modal" data-target = "#modal-register-user"
    data-id = "${data.id}"
    data-button-type = "edit">
   <i class="fas fa-edit"></i></button>`;
}

export function saveSessionDetails(data) {

  token = data.token;
  sessionStorage.setItem("user_id", data.user_id)
  sessionStorage.setItem("token", token);
  sessionStorage.setItem("username", data.username);
  sessionStorage.setItem("email", data.email);
  sessionStorage.setItem("role", data.role);
  sessionStorage.setItem("account_name", data.account_name);
  sessionStorage.setItem("account_id", data.account_id);

  localStorage.clear();

  if (data.role === "admin") {
    localStorage.setItem("state", "admin_dashboard");
  }
  else if (data.role === "investor") {
    localStorage.setItem("state", "investor_dashboard");
  } else if (data.role === "co-owner") {
    localStorage.setItem("state", "admin_dashboard");
  }
}

export function loadIdentifierTypes(){
  const identifier_types = JSON.parse(sessionStorage.getItem("identifier_types"));

  let identifierTypesArray =  []

  identifier_types.forEach( function (identifier_type, index){
      identifierTypesArray.push(
          '<option value ="',
          identifier_type.id,
          '">',
          `${identifier_type.name}`,
          "</option>"
      )

      $("#identifierType").html(identifierTypesArray.join(""));
  });

}
