import * as users from "../services/users.js";
import { fetchIncomeData } from "../services/income.js";
import * as client from "../services/clients.js";
import { fetchInterests } from "../services/interests.js";
import * as loans from "../services/loans.js";
import * as investment from "../services/investments.js";
import * as settings from "../services/settings.js";
import * as expense from "../services/expenses.js";
import { loadContent } from "../actions/contentLoader.js";
import { content_view } from "../app-views/content.js";
import { links } from "../app-views/links.js";
import * as dashboard from "../services/dashboard.js";
import * as subscription from "../services/subscription.js";

let user_role = sessionStorage.getItem("role");

const mainContent = "mainContent";
const modalContent = "modalContent";

selectContent(localStorage.getItem("state"));

$(document).ready(function () {
  if (sessionStorage.getItem("role") != null) {
    loadLinks(user_role);
  }

  //The folloing are cases links
  $("#admin-dashboard").on("click", function (e) {
    selectContent("admin_dashboard");
  });

  //The folloing are cases links
  $("#investor-dashboard").on("click", function (e) {
    selectContent("investor_dashboard");
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
  });
  $("#applications").on("click", function (e) {
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

  $("#score-names").on("click", function (e) {
    selectContent("score_names");
  });

  $("#seized-collaterals").on("click", function (e) {
    selectContent("seized_collaterals");
  });

  $("#email-subscribers").on("click", function (e) {
    selectContent("email_subscriptions");
  });

  $("#collateral-sales").on("click", function (e) {
    selectContent("collateral_sales");
  })

  $(document).on("click", "#applicationBackBtn", function (e) {
    selectContent("applications");
  });

  $(document).on("click", "#investment-packages", function (e) {
    selectContent("investment_packages");
  });

  $(document).on("click", "#investments", function (e) {
    selectContent("investments");
  });

  $(document).on("click", "#returnOfInvestiments", function (e) {
    selectContent("return_on_investments");
  });

  $(document).on("click", "#my-investments", function (e) {
    selectContent("my_investments");
  });

  $(document).on("click", "#my-rois", function (e) {
    selectContent("my_return_on_investments");
  });

  $(document).on("click", "#view-my-returns", function (e) {
    selectContent("my_return_on_investments");
  });

  $(document).on("click", "#view-my-investments", function (e) {
    selectContent("my_investments");
  });

  $(document).on("click", "#expenses", function (e) {
    selectContent("expenses");
  });

  $(document).on("click", "loan-report", function (e) {
    selectContent("loan-report");
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

  for (let index = 0; index < content_view.length; index++) {
    if (state === content_view[index].state) {
      loadOtherContent(state, index)
      break;
    }
  }
}

function loadOtherContent(state, index) {

  $.when(loadContent(mainContent, state, content_view[index].link)).done(
    function () {
      if (
        content_view[index].modals != null &&
        typeof content_view[index].modals != undefined
      ) {

        $(`#${modalContent}`).html("");

        console.log(content_view[index].modals);

        $.each(content_view[index].modals, function (key, modal_path) {
          $.when(loadContent(modalContent, "", modal_path)).done(
            function () { }
          );
        });

      }

      let user_id = sessionStorage.getItem("user_id");

      switch (state) {
        case "users":
          users.fetchUsers();
          break;
        case "individual":
          client.fetchClientsData(state);
          break;
        case "organization":
          client.fetchClientsData(state);
          break;
        case "interests":
          fetchInterests(state);
          break;
        case "investors":
          // fetchInterests(state);
          break;
        case "applications":
          populateApplicationStatusesStats(
            loans.fetchLoanApplicationsStatuses()
          );
        case "income":
          fetchIncomeData();
          break;
        case "grades":
          settings.fetchGrades();
          break;
        case "scores":
          settings.fetchScores();
          break;
        case "score_names":
          settings.fetchScoresNames();
          break;
        case "loans":
          loans.fetchLoans();
          break;
        case "loan_payments":
          loadLoanPayments();
          break;
        case "seized_collaterals":
          loans.fetchCollateralSeizures();
          break;
        case "collateral_sales":
          loans.fetchCollateralSales();
          break;
        case "collateral_sales":
          loans.fetchCollateralSales();
          break;
        case "demographics":
          loadDemographics();
          break;
        case "jobs":
          loadClientJobs();
          break;
        case "dependants":
          loadClientDependants();
          break;
        case "businesses":
          loadClientBusinesses();
          break;
        case "assets":
          loadClientAssets();
          break;
        case "other_loans":
          loadClientOtherLoans();
          break;
        case "new_applications":
          loans.fetchLoanApplications({ status_name: "NEW" });
          break;
        case "waiting_applications":
          loans.fetchLoanApplications({ status_name: "WAITING" });
          break;
        case "completed_applications":
          loans.fetchLoanApplications({ status_name: "DONE" });
          break;
        case "dumped_applications":
          loans.fetchLoanApplications({ status_name: "DUMPED" });
          break;
        case "investment_packages":
          investment.fetchInvestimentPackages();
          break;
        case "investments":
          investment.fetchInvestments();
          break;
        case "return_on_investments":
          investment.fetchReturnsOnInvestments()
          break;
        case "my_investments":
          investment.fetchMyInvestments({ user_id: user_id });
          break;
        case "my_return_on_investments":
          investment.fetchMyReturnOnInvestments({ user_id: user_id });
          break;
        case "expenses":
          expense.fetchExpensesData();
          break;
        case "investor_dashboard":
          dashboard.investor();
          break;
        case "email_subscriptions":
          subscription.fetchSubscriptions();
          break;
        case "admin_dashboard":
          dashboard.admin();
          break;
      }
    }
  );
}

function populateApplicationStatusesStats(statuses_stats) {
  statuses_stats.forEach(function (status_stat, index) {
    if (status_stat.name === "NEW") {
      $("#status-new").text(status_stat.num_of_applications);
    } else if (status_stat.name === "WAITING") {
      $("#status-waiting").text(status_stat.num_of_applications);
    } else if (status_stat.name === "DONE") {
      $("#status-completed").text(status_stat.num_of_applications);
    } else if (status_stat.name === "DUMPED") {
      $("#status-dumped").text(status_stat.num_of_applications);
    }
  });
}

function loadDemographics() {
  $.each(getDataset("clientDataSet"), function (key, value) {
    $("#demographics").find(`[id = '${key}']`).text(value);
  });

  $("#recordName").text(
    `${clientDataSet.recordFirstname} ${clientDataSet.recordLastname} Demographics`
  );
}

function loadClientJobs() {
  let currentDataset = getDataset("clientDataSet");

  $("#recordName").text(
    `${currentDataset.recordFirstname} ${currentDataset.recordLastname} Jobs`
  );

  client.fetchClientJobs({
    client_id: currentDataset.recordId,
  });
}

function loadClientDependants() {
  let currentDataset = getDataset("clientDataSet");
  $("#recordName").text(
    `${currentDataset.recordFirstname} ${currentDataset.recordLastname} Dependants`
  );

  client.fetchClientDependants({
    client_id: currentDataset.recordId,
  });
}

function loadClientBusinesses() {
  let currentDataset = getDataset("clientDataSet");
  $("#recordName").text(
    `${currentDataset.recordFirstname} ${currentDataset.recordLastname} Businesses`
  );

  client.fetchClientBusinesses({
    client_id: currentDataset.recordId,
  });
}

function loadClientAssets() {
  let currentDataset = getDataset("clientDataSet");
  $("#recordName").text(
    `${currentDataset.recordFirstname} ${currentDataset.recordLastname} Assets`
  );

  client.fetchClientAssets({
    client_id: currentDataset.recordId,
  });
}

function loadClientOtherLoans() {
  let currentDataset = getDataset("clientDataSet");

  $("#recordName").text(
    `Other Loans of ${currentDataset.recordFirstname} ${currentDataset.recordLastname}`
  );

  client.fetchClientOtherLoans({
    client_id: currentDataset.recordId,
  });
}

function loadLoanPayments() {
  let currentDataset = getDataset("loanPaymentDataset");
  $("#paymentLoanId").val(currentDataset.loanId);
  $("#paymentTitle").text(`Loan Payments for ${currentDataset.firstname} ${currentDataset.lastname}`);
  $.when(loans.fetchLoanPayments({ loan_id: currentDataset.loanId })).done(function () { });

}

function getDataset(datasetName) {
  return JSON.parse(localStorage.getItem(datasetName));
}
