import * as account from "../services/account.js";
import * as form from "../utils/forms.js"

$(document).ready(function () {
    $(document).on("click","#registerBtn", function (e){
        e.preventDefault();

        //Validation to be added for accounts password an other details
        if (password !== "" && conPassword !== null){

        }
    });

    $(document).on('blur', '#password', function (e){
        let password   = $("#password").val();
        
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

    $(document).on('blur', '#confirmPassword', function(e){
        let confirmPassword = $("#confirmPassword").val();
        let password   = $("#password").val();

        $("#wrongPasswordMatch").text("");

        if ((password !== "" && password !== null) && (confirmPassword !== "" && confirmPassword !== null)) {
            if (!(password === confirmPassword)) {
                $("#wrongPasswordMatch").text(`Does not match with new password`);
                $("#registerBtn").attr('disabled', true);
            }else{
                $("#registerBtn").attr('disabled', false);
            }
        }else {
            $("#registerBtn").attr('disabled', true);
        }        

    });
});


function registerAccountParams(){
    let name = $("#name").val();
    let address = $("#address").val();
    let email = $("#email").val();
    let phoneNumber = $("#phoneNumber").val();
    let password   = $("#password").val();
    let conPassword = $("#confPassword").val();

    let params = {
        name: name, 
        address: address,
        email: email, 
        phoneNumber: phoneNumber,
        password: password
    }

    return params
}


function validatePassword(password) {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
    return regex.test(password)
}