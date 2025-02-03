import * as users from "../services/users.js";
import * as form from "../utils/forms.js"
import { toastNote } from "../utils/utils.js"

let formType;

$(function () {

    $("#lbl-username").text(sessionStorage.getItem("username"));

    $(document).on("click", "#inviteUser", function (e) {
        if (form.validateUserInvitationForm()) {
            notification(
                users.inviter(getUserInvitationParams()).created,
                "center",
                "success",
                "users",
                "User Invitation",
                "User invitation has been added successfully",
                true,
                3000
            );
            
        }
    });

    $(document).on("click", "#acceptInvitationBtn", function(){
      
           $.when(users.register(getRegistrationParams())).done( function (data){
                if(data.created){
                     toastr.success('Registration Completed!', 'Success',5000);
                     window.location = "index.html";
                }else{
                    toastr.error(data.message, 'Error', 5000);
                }
           });
    });

    $(document).on("click", "#add-user", function (e) {
        if (form.validateUserRegistrationForm()) {
            if (formType === 'add') {
                notification(
                    users.add(getUserParams()).created,
                    "center",
                    "success",
                    "users",
                    "Add User",
                    "User has been added successfully",
                    true,
                    3000
                );
            } else {
                notification(
                    users.edit(getUserParams()).updated,
                    "center",
                    "success",
                    "users",
                    "Edit User",
                    "User has been added successfully",
                    true,
                    3000
                );
            }
        }
    });

    $(document).on('show.bs.modal', '#modal-register-user', function (e) {
        clearFields() 
        const opener = e.relatedTarget;
        formType = $(opener).attr('data-button-type');

        //Checking if the button clicked was a edit or add
        if (formType === 'add') {
            $('.modal-title').text("Add User");
        } else {
            $('.modal-title').text("Edit User")
            let $userModal = $('#modal-register-user');

            $.each(opener.dataset, function (key, value) {
                $userModal.find(`[id = '${key}']`).val(value).change();
            });
        }
    });


    $(document).on('show.bs.modal', '#modal-delete-user', function (e) {
        let opener = e.relatedTarget;
        let user_id = $(opener).attr('data-id')
        let username = $(opener).attr('data-username');

        let modal = $('#modal-delete-user');
        modal.find('[id="del-user-id"]').val(user_id);
        modal.find('[id="del-user-message"]').text("Are you sure you want to delete " + username + "?");
    });

    $(document).on('click', '#del-user-btn', function (e) {
        let user_id = $("#del-user-id").val();

        notification(
            users.delete_user({ user_id: user_id }).deleted,
            "center",
            "success",
            "delete-user",
            "Delete User",
            "User has been deleted successfully",
            true,
            3000
        );
    });

    $(document).on('click', '#settings-link', function (e) {
        $.when($("#modal-profile").modal("show")).done(function () {
            $("#profileUsername").attr('disabled', true);
            $("#profileUsername").val(sessionStorage.getItem("username"));
            $("#saveProfile").attr('disabled', true);
            $("#newPassword").attr('disabled', true);
            $("#confirmPassword").attr('disabled', true);
        });
    });

    $(document).on('blur', '#curPassword', function (e) {
        let curPassword = $("#curPassword").val();
        let email = sessionStorage.getItem("email");
        let user_id = sessionStorage.getItem("user_id");

        $("#invalidPassword").text("");
        $("#newPassword").attr('disabled', true);

        if (curPassword !== "" && curPassword !== null) {
            $.when(users.verifyCurPasword({
                user_id: user_id,
                email: email,
                cur_password: curPassword
            })).done(function (data) {
                if (!data.valid_password) {
                    $("#invalidPassword").text(`Invalid Password`);
                } else {
                    $("#newPassword").attr('disabled', false);
                }
            });
        }
    });

    $(document).on('blur', '#newPassword', function (e) {
        let newPassword = $("#newPassword").val();
        $("#wrongPassword").text("");
        $("#confirmPassword").attr('disabled', true);

        if (newPassword !== "" && newPassword !== null) {
            if (!validatePassword(newPassword)) {
                $("#wrongPassword").text(`Password should have at 
                least 6 characters, containing at least
                 one alphanumeric character, one number, 
                 and one special character`);
            } else {
                $("#confirmPassword").attr('disabled', false);
            }
        }
    });

    $(document).on('blur', '#confirmPassword', function (e) {
        let confirmPassword = $("#confirmPassword").val();
        let newPassword = $("#newPassword").val();

        $("#wrongPasswordMatch").text("");

        if ((newPassword !== "" && newPassword !== null) && (confirmPassword !== "" && confirmPassword !== null)) {
            if (!(newPassword === confirmPassword)) {
                $("#wrongPasswordMatch").text(`Does not match with new password`);
                $("#saveProfile").attr('disabled', true);
            } else {
                $("#saveProfile").attr('disabled', false);
            }
        }
    });

    $(document).on('click', '#saveProfile', function (e) {
        let user_id = sessionStorage.getItem("user_id");
        let newPassword = $("#newPassword").val();

        $.when(users.updateProfile({ user_id: user_id, new_password: newPassword })).done(
            function (data) {
                if (data.updated) {
                    // notify("center", "success", "Updated Profile", "User has been deleted successfully", false, 1500);
                    $("#modal-profile").modal("hide");
                } else {
                    // notify("center", "warning", "Updated Profile", "Failed to update user profile", false, 1500);
                    $("#modal-profile").modal("hide");
                }

            });
    });

    $(document).on('click', '#sendOTPBtn', function (e) {
        let email = $("#recoveryEmail").val();

        $.when(users.sendOTP({ email: email})).done(
            function (data){
                if (data.otp_sent){
                    localStorage.setItem("recoveryEmail", email);
                    window.location = "verify_otp.html"                    
                } else {

                }
            }
        )
    });

    $(document).on('click', '#verifyOTPBtn', function (e) {
        let otpCode = $("#otpCode").val();
        let email = localStorage.getItem("recoveryEmail");
        
        $.when(users.verifyOTP({ otp_code: otpCode,
                                email: email})).done(
            function (data){
                if (data.valid_otp){
                     $.when(users.saveSessionDetails(data)).done(function (){
                        window.location = "thumba.html";
                     });

                } else {

                }
            }
        )
    });

});

function validatePassword(password) {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
    return regex.test(password)
}

function getUserInvitationParams(){
    let email  = $("#email").val();
    let password = $("#role").val();

    let params = {
        email: email,
        role: password
    }

    return params
}

function getRegistrationParams(){
    const url = new URL(window.location.href);

// Use URLSearchParams to get the token value from the query string
    const url_params = new URLSearchParams(url.search);
    const token = url_params.get('token'); 
    const username = $("#username").val();
    const identifier = $("#identifier").val();
    const identifierType = $("#identifierType").val();
    const firstname = $("#firstname").val();
    const lastname = $("#lastname").val();
    const password = $("#password").val();

    let params = {
        identifier: identifier,
        identifier_type_id: identifierType,
        firstname: firstname,
        lastname: lastname,
        username: username,
        password: password,
        token: token
    }

    return params;
}

function getUserParams() {
    let user_id = $("#userId").val();
    let username = $("#username").val();
    let firstname = $("#firstname").val();
    let lastname = $("#lastname").val();
    let national_id = $("#nationalId").val();
    let email = $("#email").val();
    let role = $("#role").val();

    let params = {
        user_id: user_id,
        national_id: national_id,
        username: username,
        firstname: firstname,
        lastname: lastname,
        email: email,
        role: role
    }

    return params;
}

function notification(
    isDone,
    position,
    icon,
    recordType,
    title,
    text,
    showConfirmButton,
    timer
) {
    if (isDone)
        $.when(
            Swal.fire({
                position: position,
                icon: icon,
                title: title,
                text: text,
                showConfirmButton: showConfirmButton,
                timer: timer,
            })
        ).done(function () {
            if (recordType === "users") {
                $.when(users.fetchUsers()).done(function () {
                    $("#modal-register-user").modal("hide");
                });
            } else if (recordType === "delete-user") {
                $.when(users.fetchUsers()).done(function () {
                    $("#modal-delete-user").modal("hide");
                });
            }
        });
}

function clearFields() {
    $("#username").val("");
    $("#firstname").val("");
    $("#lastname").val("");
    $("#nationalId").val("");
    $("#email").val("");

}

