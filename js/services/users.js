
import * as validator from "./validator.js";

import { setTableAttributes } from "./table_attributes.js"

import { apiClient } from "./api-client.js";

let token = sessionStorage.getItem("token");

export function add(national_id, username, firstname, lastname, email, role) {


    let user_data = {
        national_id: national_id,
        username: username,
        firstname: firstname,
        lastname: lastname,
        email: email,
        role: role
    };

    return apiClient("/api/v1/new_user", 'POST', 'json', false, false, user_data);

}

export function edit(user_id, national_id, username, firstname, lastname, email, role) {

    let user_data = {
        user_id: user_id,
        national_id: national_id,
        username: username,
        firstname: firstname,
        lastname: lastname,
        email: email,
        role: role
    };

    return apiClient("/edit_user", 'POST', 'json', false, false, user_data);

}


export function login(formData) {

    $.when(apiClient("/api/v1/auth/login", 'POST', 'json', false, false, formData)).done(
        function (data) {
            if (data != null) {
                token = data.token;
                sessionStorage.setItem("token", token)
                sessionStorage.setItem("username", data.username);
                sessionStorage.setItem("email", data.email);
                sessionStorage.setItem("role", data.role);
                localStorage.setItem("state", "dashboard");
                window.location = "thumba.html";
            } else {
                //Display an error here
            }
        }
    )
}



export function populateUsersTable() {

    let data = apiClient("/api/v1/users", 'GET', 'json', false, false, {});

    if (data != null) {
        for (var i = 0; i < data.length; i++) {
            drawUserRow(data[i]);
        }
        setTableAttributes('#usersTable');
    }
}

function drawUserRow(rowData) {
    var row = $("<tr ' />");
    $("#usersTable").append(row);
    row.append($("<td>" + rowData.id + "</td>"));
    row.append($("<td>" + rowData.national_id + "</td>"));
    row.append($("<td>" + rowData.username + "</td>"));
    row.append($("<td>" + rowData.firstname + "</td>"));
    row.append($("<td>" + rowData.lastname + "</td>"));
    row.append($("<td>" + rowData.email + "</td>"));
    row.append($("<td>" + rowData.role + "</td>"));

    row.append($("<td><button class='btn  bg-gradient-primary ' id='btnAddSites' data-toggle='modal' " +
        "data-target='#modal-edit-user'  " + "data-user-data = '" + JSON.stringify(rowData) + "' " +
        "'data-button-type = 'edit' > </i><i class='fas fa-user-secret'></i> </button></td>"));

    row.append($("<td><button class='btn  bg-gradient-danger ' id='delete-user' data-toggle='modal' " +
        "data-target='#modal-delete-user' data-id ='" + rowData.id + "' " +
        "data-username='" + rowData.username + "' > </i><i class='fas fa-trash'></i> </button></td>"));
}

export function delete_user(user_id) {

    return apiClient("/delete_user", 'POST', 'json', false, false, { user_id: user_id });
}



