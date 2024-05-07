import { apiClient } from "./api-client.js";
import { sharesOptions } from "../services/chartsOptions/shares.js";
import { returnsInvestmentsOptions } from "../services/chartsOptions/returns_and_investments.js"
import { myInvestmentOptions } from "../services/chartsOptions/my_investments.js"
import { returnsGrowthOptions } from "../services/chartsOptions/returns_growth.js"

let nf = new Intl.NumberFormat('en-US');
let dashboardData;
$(function () {
  $(document).on("click", "#sharesDonutLink", function () {
    populateSharesChart(dashboardData.investors);
  });
});

export function admin() {
  dashboardData = fetchAdminDashboardData();
  populateSharesChart(dashboardData.investors);
  populateReturnsGrowthChart(dashboardData.all_returns);
  $("#totalClients").text(nf.format(dashboardData.client_count));
  $("#totalUsers").text(nf.format(dashboardData.user_count));
  $("#totalRevenue").text(`MK${nf.format(dashboardData.total_revenue)}`);
  $("#totalIncome").text(`MK${nf.format(dashboardData.total_income)}`);
  $("#currentlyLoaned").text(`MK${nf.format(dashboardData.currently_loaned)}`);
  $("#totalProfits").text(`MK${nf.format(dashboardData.expected_profit)}`);
  $("#totalAvailable").text(`MK${nf.format(dashboardData.total_available)}`);
  $("#totalExpenses").text(`MK${nf.format(dashboardData.total_expenses)}`);
}

export function investor() {
  dashboardData = fetchInvestorDashboardData();

  // Check if dashboardData.total_investment_and_returns[0] is defined
  if (dashboardData.total_investment_and_returns && dashboardData.total_investment_and_returns.length > 0) {
    const totalInvestment = dashboardData.total_investment_and_returns[0].amount;
    const totalROI = dashboardData.total_investment_and_returns[0].roi;

    // Check if totalROI is defined
    if (typeof totalInvestment !== 'undefined' && typeof totalROI !== 'undefined') {
      populateReturnsInvestmentChart(dashboardData.return_on_investments);
      $("#totalInvestiments").text(`MK${nf.format(totalInvestment)}`);
      $("#totalReturns").text(`MK${nf.format(totalROI)}`);
      $("#totalPackages").text(`${nf.format(dashboardData.investment_packages_count)}`);
    } else {
      // Handle case where either totalInvestment or totalROI is undefined
      console.error('Total investment or ROI is undefined.');
    }
  } else {
    // Handle case where dashboardData.total_investment_and_returns[0] is undefined
    console.error('Total investment data is undefined.');
  }
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

function populateReturnsGrowthChart(all_returns) {

  returnsGrowthOptions.series = all_returns.packages_returns;
  returnsGrowthOptions.yaxis.min = all_returns.max_min.min_rio;
  returnsGrowthOptions.yaxis.max = all_returns.max_min.max_rio;

  let myInvestmentChart = new ApexCharts(
    document.querySelector("#returns-growth"),
    returnsGrowthOptions 
  );

  myInvestmentChart.render();
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

function populateReturnsInvestmentChart(returns_investments) {
  returnsInvestmentsOptions.series = [];
  myInvestmentOptions.series = [];

  returns_investments.forEach(function (return_investment, index) {
    returnsInvestmentsOptions.series.push({
      name: `${return_investment.name} Returns`,
      data: return_investment.rois
    })

    myInvestmentOptions.series.push({
      name: `${return_investment.name} Investments`,
      data: return_investment.total_investment_amounts
    });
  })


  let sharesChart = new ApexCharts(
    document.querySelector("#returnsAndInvestments"),
    returnsInvestmentsOptions
  );

  sharesChart.render();

  let myInvestmentChart = new ApexCharts(
    document.querySelector("#myInvestmentsChart"),
    myInvestmentOptions
  );

  myInvestmentChart.render();
}

function fetchAdminDashboardData() {
  let data = apiClient("/api/v1/admin_dashboard_stats", "GET", "json", false, false, { });
  if (data != null) {
    return data;
  }
}

function fetchInvestorDashboardData() {
  let data = apiClient("/api/v1/investor_dashboard_stats", "GET", "json", false, false, { });
  if (data != null) {
    return data;
  }
}
