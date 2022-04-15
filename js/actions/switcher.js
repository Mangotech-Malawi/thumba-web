import * as users from "../services/users.js";
import { fetchClientsData } from "../services/clients.js";

import { content_view } from "../app-views/content.js";

let user_role = sessionStorage.getItem("role");

selectContent(localStorage.getItem("state"));

$(document).ready(function () {
  if (sessionStorage.getItem("role") != "admin") {
    $(".admin-link-item").hide();
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

export function selectContent(state) {
  for (let index = 0; index < content_view.length; index++) {
    if (state === content_view[index].state) {
      if (user_role === "admin" && state === "dashboard")
        $.when(
          loadContent(
            state,
            content_view[index].title,
            content_view[index].links[0]
          )
        ).done(function () {
          //load dashboard stats
        
        });
      else if (user_role === "investor" && state === "dashboard")
        $.when(
          loadContent(
            state,
            content_view[index].title,
            content_view[index].links[1]
          )
        ).done(function () {
          //load dashboard datas
        });
      else if (user_role === "loan officer" && state === "dashboard")
        $.when(
          loadContent(
            state,
            content_view[index].title,
            content_view[index].links[2]
          )
        ).done(function () {
          //load dashboard datas
        });
      else
        $.when(
          loadContent(
            state,
            content_view[index].title,
            content_view[index].link
          )
        ).done(function () {
          switch (state) {
            case "users":
              users.populateUsersTable();
              break;
            case "clients":
              fetchClientsData();
              break;
          }
        });
    }
  }
}

function loadContent(newState, title, urlPath) {
  $.ajax({
    url: urlPath,
    data: {},
    type: "GET",
    async: false,
    success: function (resp) {
      $("#mainContent").html("");

      $("#mainContent").append(resp);

      $("#pageTitle").text("");

      $("#pageTitle").text(title);

      localStorage.setItem("state", newState);
    },
    error: function () {
      $("#mainContent").append(
        "<h>" + title + " view could not be loaded </h1>"
      ); //Displays an error message if content is not loaded;
    },
  });
}
