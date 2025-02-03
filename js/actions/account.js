import * as account from "../services/account.js";
import * as form from "../utils/forms.js"
import { toastNote } from "../utils/utils.js"

$(document).ready(function () {
    $(document).on("click", "#registerBtn", function (e) {
        e.preventDefault();

        if (account.register(registerAccountParams()).created) {
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

    $(document).on('change', '.account-status', function (e) {
        // Get the value of the data-active attribute from the checkbox
        let checkbox = $(this);
        let data = checkbox.data();

        notification(
            account.changeAccountStatus({ id: data.id }).updated,
            "center",
            "success",
            "accounts",
            "Account Status",
            "Account status has been changed succesfully",
            true,
            3000
        )
    });

    $(document).on('change', '#logoUpload', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById('logoPreview').src = e.target.result;
                document.getElementById('logoPreview').style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    $(document).on('click', '#uploadLogoButton', function (e) {
        e.preventDefault();

        const fileInput = document.getElementById("logoUpload");
        const account_id = sessionStorage.getItem("account_id");

        // Access the captured image file
        const files = fileInput.files; // Contains the captured image
        const imageFile = files ? files[0] : null;

        if (imageFile) {
            account.uploadLogo(account_id, imageFile);
        } else {
            console.error("No file selected or captured.");
            alert("Please capture or select an image before uploading.");
        }
    });

});


function registerAccountParams() {
    const name = $("#name").val();
    const address = $("#address").val();
    const email = $("#email").val();
    const phoneNumber = $("#phoneNumber").val();
    const username = $("#username").val();
    const userEmail = $("#userEmail").val();
    const identifier = $("#identifier").val();
    const identifierType = $("#identifierType").val();
    const firstname = $("#firstname").val();
    const lastname = $("#lastname").val();
    const password = $("#password").val();

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
        identifier: identifier,
        identifier_type_id: identifierType
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
                    $.when(account.fetchAccounts()).done(function () {

                    });
                    break;
            }
        });
}



function validatePassword(password) {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
    return regex.test(password)
}

// Set the details of the account like Name
export function populateAccountDetails() {
    $("#accountName").val(sessionStorage.getItem("account_name"));
    $("#accountAddress").val(sessionStorage.getItem("account_address"));
    $("#accountEmail").val(sessionStorage.getItem("account_email"));
    $("#accountPhoneNumber").val(sessionStorage.getItem("account_phone_number"));
    console.log(sessionStorage.getItem("account_logo"));
    $("#logoPreview").attr("src",sessionStorage.getItem("account_logo"));
}