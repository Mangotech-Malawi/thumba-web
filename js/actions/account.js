import * as account from "../services/account.js";

$(document).ready(function () {
    $(document).on("click","#registerBtn", function (e){
        e.preventDefault();

        //Validation to be added for accounts password an other details

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