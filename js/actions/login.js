
import * as user from "../services/users.js";
import { login_view } from "../app-views/content.js";

import { loadContent } from "../actions/contentLoader.js";


let state = localStorage.getItem("state");
const mainContent = "mainContent";

const LOGIN_STATE = "login";


if(state == null || typeof state === undefined || state === ""){
    selectContent(LOGIN_STATE);
} else {
    selectContent(state);
}

$(document).ready(function () {

    $('#loginForm').on('submit', function(e){

        e.preventDefault();

        let username = $('username').val();
        let password = $('password').val();
        var formData = $(this).serialize();
        
        user.login(formData );
    });

    $('#homeBtn').on('click', function(e){
        window.location = "index.html";
    });

    $(document).on('click',"#forgotPasswordBtn", function(e){
        selectContent("forgot_password");
    });

    $(document).on('click',"#registerMembershipBtn", function(e){
        selectContent("register");
    });

    $(document).on('click',"#verifyOtpBtn", function(e){
        selectContent("verify_otp");
    });

    $(document).on('click',"#loginLink", function(e){
        selectContent("login");
    });

});

export function selectContent(state){
    for ( let index = 0; index < login_view.length; index++){
        if(state === login_view[index].state ){
            loadOtherContent(state, index);
            break;
        }
    }
}

function loadOtherContent(state, index){
    $.when(loadContent(mainContent, state, login_view[index].link)).done(
        function () { 
           
         }
    );
}
