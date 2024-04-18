import * as account from "../services/account.js";
import * as form from "../utils/forms.js"
import { toastNote } from "../utils/utils.js"

$(document).ready(function () {
    $(document).on("click", "#registerBtn", function (e) {
        e.preventDefault();

        if(account.register(registerAccountParams()).created){
            window.location("index.html");
        }

    });

    $(document).on('blur', '#password', function (e) {
        let password = $("#password").val();

        $("#wrongPassword").text("");

        if (password !== "" && password !== null) {
            if (!validatePassword(password)) {
                $("#wrongPassword").text(`Password should have at 
                least 6 characters, containing at least
                 one alphanumeric character, one number, 
                 and one special character`);
            } else {
                $("#registerBtn").attr('disabled', false);
            }
        } else {
            $("#registerBtn").attr('disabled', true);
        }

    });

    $(document).on('blur', '#confirmPassword', function (e) {
        let confirmPassword = $("#confirmPassword").val();
        let password = $("#password").val();

        $("#wrongPasswordMatch").text("");

        if ((password !== "" && password !== null) && (confirmPassword !== "" && confirmPassword !== null)) {
            if (!(password === confirmPassword)) {
                $("#wrongPasswordMatch").text(`Does not match with new password`);
                $("#registerBtn").attr('disabled', true);
            } else {
                $("#registerBtn").attr('disabled', false);
            }
        } else {
            $("#registerBtn").attr('disabled', true);
        }

    });
});


function registerAccountParams() {
    let name = $("#name").val();
    let address = $("#address").val();
    let email = $("#email").val();
    let phoneNumber = $("#phoneNumber").val();
    let username   = $("#username").val();
    let userEmail = $("#userEmail").val();
    let nationalId = $("#nationalId").val();
    let firstname = $("#firstname").val();
    let lastname = $("#lastname").val();
    let password = $("#password").val();

    let params = {
        name: name,
        address: address,
        email: email,
        phone_number: phoneNumber,
        password: password,
        username: username,
        user_email: userEmail, 
        firstname: firstname,
        lastname: lastname,
        national_id: nationalId
    }

    return params
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
            switch (recordType) {
                case "accounts":
                    $.when(investment.fetchInvestimentPackages()).done(function () {
                        $(investmentPackageModal).modal("hide");
                    });
                    break;
            }
        });
}



function validatePassword(password) {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
    return regex.test(password)
}