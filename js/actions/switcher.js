import * as users from "../services/users.js";
import { fetchClientsData } from "../services/clients.js";
import { fetchInterests } from "../services/interests.js";

import { content_view } from "../app-views/content.js";
import { links } from "../app-views/links.js";

let user_role = sessionStorage.getItem("role");

const mainContent = "mainContent";
const modalContent = "modalContent";

selectContent(localStorage.getItem("state"));

$(document).ready(function () {
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

  });

  $("#interests").on("click", function (e) {
    console.log("in here clicing inter");
    selectContent("interests");
  });

  $("#logout").on("click", function (e) {
    sessionStorage.clear();
    users.logout();
  });
});

function loadLinks(user_role) {
  for (let index = 0; index < links.length; index++) {
    if (user_role === links[index].role) {
      $.when(loadContent("sidebarLinks", "", links[index].link)).done(
        function () {
          //load dashboard stats
        }
      );
    }
  }
}

export function selectContent(state) {
  const adminDashboardIndex = 0;
  const financeDashboardIndex = 1;
  const investorDashboardIndex = 2;
  const loanOfficerDashboardIndex = 3;

  for (let index = 0; index < content_view.length; index++) {
    if (state === content_view[index].state) {
      if (user_role === "admin" && state === "dashboard") {
        loadDashboard(adminDashboardIndex, state, index);
      } else if (user_role === "finance" && state === "dashboard") {
        loadDashboard(financeDashboardIndex, state, index);
      } else if (user_role === "investor" && state === "dashboard") {
        loadDashboard(investorDashboardIndex, state, index);
      } else if (user_role === "loan-officer" && state === "dashboard") {
        loadDashboard(loanOfficerDashboardIndex, state, index);
      } else {
        loadOtherContent(state, index);
      }
    }
  }

}

function loadDashboard(linkIndex, state, index) {
  $.when(
    loadContent(mainContent, state, content_view[index].links[linkIndex])
  ).done(function () {
    //load dashboard datas
  });
}

function loadOtherContent(state, index) {
  $.when(loadContent(mainContent, state, content_view[index].link)).done(
    function () {
     
      if (
        content_view[index].modals != null &&
        typeof content_view[index].modals != undefined
      ) {
        $.when(loadContent(modalContent, "", content_view[index].modals)).done(
          function () {
      
          }
        );
      }

      switch (state) {
        case "users":
          users.populateUsersTable();
          break;
        case "clients":
          fetchClientsData();
          break;
        case "interests":
          console.log("here to fetch");
          fetchInterests();
          break;     
      }

    }
  );
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
