import * as users from "../services/users.js";
import { fetchClientsData } from "../services/clients.js";

import { content_view } from "../app-views/content.js";



selectContent(localStorage.getItem("state"));

$(document).ready(function () {
  
  let user_role = sessionStorage.getItem("role");

  if (sessionStorage.getItem("role") != null) {
    loadLinks(user_role);
  }

  //The folloing are cases links
  $("#dashboard-link").on("click", function (e) {
    selectContent("dashboard");
  });

  $("#clients").on("click", function (e) {
    selectContent("clients");
  });

  //The folloing are user management links
  $("#loans").on("click", function (e) {
    selectContent("loans");
  });

  $("#users").on("click", function (e) {
    selectContent("users");
    console.log("users clicked");
  });

  $("#logout").on("click", function (e) {
    sessionStorage.clear();
    users.logout();
  });
});


function loadlinks(user_role){
   if(user_id = "admin"){
     
   }
}



export function selectContent(state) {
  const mainContent = "mainContent";
  const modalContent = "modalContent";

  for (let index = 0; index < content_view.length; index++) {
    if (state === content_view[index].state) {
      if (user_role === "admin" && state === "dashboard")
        $.when(
          loadContent(mainContent, state, content_view[index].links[0])
        ).done(function () {
          //load dashboard stats
        });
      else if (user_role === "investor" && state === "dashboard")
        $.when(
          loadContent(mainContent, state, content_view[index].links[1])
        ).done(function () {
          //load dashboard datas
        });
      else if (user_role === "loan officer" && state === "dashboard")
        $.when(
          loadContent(mainContent, state, content_view[index].links[2])
        ).done(function () {
          //load dashboard datas
        });
      else
        $.when(
          loadContent(mainContent, state, content_view[index].link),
        ).done(function () {
            $.when(
                loadContent(modalContent, "", content_view[index].modals)).done(function (){
                    switch (state) {
                        case "users":
                          users.populateUsersTable();
                          break;
                        case "clients":
                          fetchClientsData();
                          break;
                      }
                });
        });
    }
  }
}

function loadContent(containerId, newState, urlPath) {
  $.ajax({
    url: urlPath,
    data: {},
    type: "GET",
    async: false,
    success: function (resp) {
      $(`#${containerId}`).html("");

      $(`#${containerId}`).append(resp);

      /*$("#pageTitle").text("");

      $("#pageTitle").text(title);*/
      if (newState != "") localStorage.setItem("state", newState);
    },
    error: function () {
      /* $(``).append(
        "<h>" + title + " view could not be loaded </h1>"
      ); //Displays an error message if content is not loaded;*/
    },
  });
}
