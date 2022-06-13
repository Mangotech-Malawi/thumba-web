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
        let national_id = $("#nationalId").val();
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
            let user_id = $("#userId").val();
            let resp = users.edit(user_id, national_id, username, firstname, lastname, email, role);
            if (resp != null) {
                if(resp.updated){
                    $("#modal-edit-user").modal('hide');
                    notify("center", "success", "Edit user", "User has been edited successfully", false, 3000);
                    users.loadUsersTable(users.fetchUsers());
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
            $('#add-user').text("Save");
            $('.alt-btn').attr("data-dismiss", "modal");
            $('.alt-btn').text("Close");
            $('.modal-title').text("Edit User");
            let $userModal = $('#modal-edit-user');

            $.each(opener.dataset, function(key, value){
                $userModal.find(`[id = '${key}']`).val(value);
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
        $("#nationalId").val("");
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
            notify("center", "success", "Deleted User", "User has been deleted successfully", false, 1500);
            users.loadUsersTable(users.fetchUsers());
        }
    });

});