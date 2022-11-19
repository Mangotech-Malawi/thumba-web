import * as users from "../services/users.js";
import { fetchIncomeData } from "../services/income.js";
import { fetchClientsData } from "../services/clients.js";
import { fetchInterests } from "../services/interests.js";
import * as loans from "../services/loans.js"
import { loadContent } from "../actions/contentLoader.js";
import { content_view } from "../app-views/content.js";
import { links } from "../app-views/links.js";
import * as dashboard from "../services/dashboard.js"


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

  $("#individualClient").on("click", function (e) {
    selectContent("individual");
  });

  $("#orgClient").on("click", function (e) {
    selectContent("organization");
  });

  //The folloing are user management links
  $("#loans").on("click", function (e) {
    selectContent("loans");
  });

  $("#users").on("click", function (e) {
    selectContent("users");
  });  $("#applications").on("click", function (e) {
    selectContent("applications");
  });


  $("#interests").on("click", function (e) {
    selectContent("interests");
  });

  $("#investors").on("click", function (e) {
    selectContent("investors");
  });

  $("#income").on("click", function (e) {
    selectContent("income");
  });

  $("#applications").on("click", function (e) {
    selectContent("applications");
  });

  $("#loans").on("click", function (e) {
    selectContent("loans");
  });


  $("#grades").on("click", function (e) {
    selectContent("grades");
  });


  $("#scores").on("click", function (e) {
    selectContent("scores");
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
  const coOwnerDashboardIndex = 4;

  for (let index = 0; index < content_view.length; index++) {
    if (state === content_view[index].state) {
      if (user_role === "co-owner" && state === "dashboard") {
        loadDashboard(coOwnerDashboardIndex, state, index);
        break;
      } else if (user_role === "finance" && state === "dashboard") {
        loadDashboard(financeDashboardIndex, state, index);
        break;
      } else if (user_role === "investor" && state === "dashboard") {
        loadDashboard(investorDashboardIndex, state, index);
        break;
      } else if (user_role === "loan-officer" && state === "dashboard") {
        loadDashboard(loanOfficerDashboardIndex, state, index);
        break;
      } else if( user_role === "admin" &&  state === "dashboard"){
        $.when(loadDashboard(adminDashboardIndex , state, index)).done( function (){
          dashboard.admin();
        });
        break;
      } 
      else {
        loadOtherContent(state, index);
        break;
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
          function () {}
        );
      }

      switch (state) {
        case "users":
          users.loadUsersTable(users.fetchUsers());
          break;
        case "individual":
          1;
          fetchClientsData(state);
          break;
        case "organization":
          fetchClientsData(state);
          break;
        case "interests":
          fetchInterests(state);
          break;
        case "investors":
          // fetchInterests(state);
          break;
        case "applications":
          loans.fetchLoanApplications();
        case "income":
          fetchIncomeData();
          break;
      }
    }
  );
}
