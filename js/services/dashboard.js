import { apiClient } from "./api-client.js";
import { sharesOptions } from "../services/chartsOptions/shares.js";
import { returns_and_investments } from "../services/chartsOptions/returns_and_investments.js"

let nf =  new Intl.NumberFormat('en-US');
let dashboardData;
$(function () {
  $(document).on("click", "#sharesDonutLink", function () {
    populateSharesChart(dashboardData.investors);
  });
});

export function admin() {
  dashboardData = fetchClientsData();
  populateSharesChart(dashboardData.investors);
  $("#totalClients").text(nf.format(dashboardData.client_count));
  $("#totalUsers").text(nf.format(dashboardData.user_count));
  $("#totalRevenue").text(`MK${nf.format(dashboardData.total_revenue)}`);
  $("#totalIncome").text(`MK${nf.format(dashboardData.total_income)}`);
}

export function investor(){
  populateReturnsInvestmentChart();
}

function populateSharesChart(investors) {
  $("#sharesContributionTitle").text("Shares & Contributions Chart");
  sharesOptions.series = [];
  sharesOptions.labels = [];
  investors.forEach(function (investor, index) {
    sharesOptions.series.push(investor.total_contribution);
    sharesOptions.labels.push(`${investor.firstname}`);
  });

  sharesOptions.chart.events = {
    dataPointSelection: function (event, chartContext, config) {
      let investor = investors[config.dataPointIndex];

      $("#shareContribution").html(sharesContibutionTable());
      $("#sharesContributionTitle").text(
        `${investor.firstname} ${investor.lastname} contributions`
      );

      $.fn.DataTable.ext.pager.numbers_length = 5;

      loadInvestorContributionData(investor.incomes);
    },
  };

  $("#shareContribution").html(getPieChart());
  let sharesChart = new ApexCharts(
    document.querySelector("#shares-donut"),
    sharesOptions
  );

  sharesChart.render();
}

function loadInvestorContributionData(investorIncomes) {
  $("#investorContributionTable").DataTable({
    destroy: true,
    responsive: true,
    lengthChange: true,
    autoWidth: false,
    paging: true,
    searching: false,
    ordering: true,
    data: investorIncomes,
    columns: [{ data: "id" }, { data: "amount" }, { data: "created_at" }],
  });
}

function getPieChart() {
  return `<div id="shares-donut"></div>`;
}

function sharesContibutionTable() {
  return `<div class="Scroll p-3"><table id="investorContributionTable" class="table table-bordered table-striped ">
          <thead>
            <tr>
            <th>Id</th>
              <th>Amount(MWK)</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody></tbody>
          <tfoot>
            <tr>
            <th>Id</th>
            <th>Amount(MWK)</th>
            <th>Date</th>
            </tr>
          </tfoot>
        </table></div>`;
}

function populateReturnsInvestmentChart(){

  let sharesChart = new ApexCharts(
    document.querySelector("#returnsAndInvestments"),
    returns_and_investments 
  );

  sharesChart.render();
}

function fetchClientsData() {
  let data = apiClient("/api/v1/dashboard", "GET", "json", false, false, {});
  if (data != null) {
    return data;
  }
}
