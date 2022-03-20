import * as users from "../services/users.js";

import { selectContent } from "../actions/switcher.js"

import { notify } from "../services/utils.js"

let formType;
let addedUsers = 0;

$(document).ready(function () {

    $("#lbl-username").text(sessionStorage.getItem("username"));

    $(document).on('click', '#add-user', function (e) {

        let username = $("#username").val();
        let firstname = $("#firstname").val();
        let lastname = $("#lastname").val();
        let national_id = $("#national_id").val();
        let email = $("#email").val();
        let contact = $("#contact").val();
        let role = $("#role").val();


        if (formType === 'add') {
            let result = users.add(national_id, username, firstname, lastname, email, contact, role);
            if (result != null) {
                addedUsers++;
                clearFields();
            }
        } else {
            let user_id = $("#user-id").val();
            let resp = users.edit(user_id, national_id, username, firstname, lastname, email, role);
            if (resp != null) {
                if(resp.updated){
                    $("#modal-edit-user").modal('hide');
                    notify("center", "success", "Edit user", "User has been edited successfully", false, 3000);
                    selectContent("users");
                }
            }
        }

    });

    $(document).on('show.bs.modal', '#modal-edit-user', function (e) {
        let opener = e.relatedTarget;
        formType = $(opener).attr('data-button-type');

        //Checking if the button clicked was a edit or add
        if (formType === 'add') {
            $('.modal-title').text("Add User");
            $('#add-user').text("Add");
            $('.alt-btn').removeAttr("data-dismiss");
            $('.alt-btn').text("Finish");
        } else {

            let user_data = JSON.parse($(opener).attr('data-user-data'));
            $('#add-user').text("Save");
            $('.alt-btn').attr("data-dismiss", "modal");
            $('.alt-btn').text("Close");
            $('.modal-title').text("Edit User");
            let userModal = $('#modal-edit-user');

            Object.entries(user_data).forEach(([key, value]) => {
                if (key === "role"){
                    userModal.find('[id="' + key + '"] option[value="' + value + '"]').prop('selected', true);
                }
                else if (key === "id"){
                    userModal.find('[id="user-id"]').val(value);
                }else{
                    userModal.find('[id="' + key + '"]').val(value);
                }
            });

        }
    });

    $(document).on("click", '.alt-btn', function () {
        if (addedUsers > 0) {
            $("#modal-edit-user").modal('hide');
            notify("center", "success", "Add user", "You have succesfully added " + addedUsers +
                " user(s)", false, 6000);
            selectContent("users");
        } else {
            $("#modal-edit-user").modal('hide');
        }
    })

    $(document).on('hide.bs.modal', '#modal-edit-user', function (e) {
        clearFields();
    });

    function clearFields() {
        $("#username").val("");
        $("#firstname").val("");
        $("#lastname").val("");
        $("#national_id").val("");
        $("#email").val("");
        
    }

    $(document).on('show.bs.modal', '#modal-delete-user', function (e) {

        let opener = e.relatedTarget;
        let user_id = $(opener).attr('data-id');
        let username = $(opener).attr('data-username');

        let modal = $('#modal-delete-user');
        modal.find('[id="del-user-id"]').val(user_id);
        modal.find('[id="del-user-message"]').text("Are you sure you want to delete " + username + "?");
    });

    $(document).on('click', '#del-user-btn', function (e) {
        let resp = users.delete_user($("#del-user-id").val());
        if (resp.deleted) {
            $("#modal-delete-user").modal('hide');
            notify("center", "success", "Deleted User", "User has been deleted successfully", false, 6000);
            selectContent("users");
        }
    });

});