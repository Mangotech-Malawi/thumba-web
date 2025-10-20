import * as report from "../services/reports.js";
import * as contentLoader from "../actions/contentLoader.js";

$(function () {
  const tabLoaders = {
    "loan-reports": () => {
      $.when(contentLoader.loadContent("loan-reports", "reports", "views/reports/loans.html"))
        .done(function (){});
    },
    "finance-reports": () => {
      $.when(contentLoader.loadContent("finance-reports", "reports", "views/reports/finance.html"))
        .done(function (){});
    },
    "shares-reports": () => {
      $.when(contentLoader.loadContent("shares-reports", "reports", "views/reports/shares.html"))
        .done(function (){});
    },
    "admin-reports": () => {
      $.when(contentLoader.loadContent("admin-reports", "reports", "views/reports/admin.html"))
        .done(function (){
           
        });
    },
    "system-reports": () => {
      $.when(contentLoader.loadContent("system-reports", "reports", "views/reports/superuser.html"))
        .done(function (){
           
        });
    }
  };

  // Click registration
  Object.entries(tabLoaders).forEach(([id, handler]) => {
    $(document).on("click", `#${id}-tab`, handler);
  });

  // Auto-load previous active tab
  const savedTab = localStorage.getItem("reports_active_tab");
  if (savedTab && tabLoaders[savedTab]) {
    tabLoaders[savedTab]();
  }

  // Report file downloads
  $(document).on("click", ".users-report-btn", function (e) {
    e.preventDefault();
    const { documentType } = $(this).data();

    if (documentType === "csv") {
      downloadCSV();
    } else {
      $.when(report.users({ document_type: documentType })).done(downloadPDF);
    }
  });


  $(document).on("click", "#adminFilterBtn", function(){
    const startDate = $('#adminReportStartDate').val() || 'Start not set';
    const endDate = $('#adminReportEndDate').val() || 'End not set';

    // Display range 
    $('#adminReportDateRange').text(`${startDate} - ${endDate}`);

     $.when(report.admin({start_date: startDate, end_date: endDate})).done(function(resp){
        $("#totalUsers").text(resp.admin_report_stats.total_users);
        $("#totalBranches").text(resp.admin_report_stats.total_branches);
        $("#totalInvitations").text(resp.admin_report_stats.invitations.total_invitations);
        $("#acceptedYes").text(resp.admin_report_stats.invitations.accepted.yes);
        $("#acceptedNo").text(resp.admin_report_stats.invitations.accepted.no);

         // Reset role counts to 0 to avoid carryover
        $("#roleSysAdmin, #roleLoanOfficer, #roleBranchLoanOfficer, #roleCoOwner").text(0);

        // Loop through user roles
        resp.admin_report_stats.user_role_count.forEach(role => {
            switch (role.name) {
                case "System Administrator":
                    $("#roleSysAdmin").text(role.number_of_users);
                    break;
                case "Loan Officer":
                    $("#roleLoanOfficer").text(role.number_of_users);
                    break;
                case "Branch Loan Officer":
                    $("#roleBranchLoanOfficer").text(role.number_of_users);
                    break;
                case "Co-Owner":
                    $("#roleCoOwner").text(role.number_of_users);
                    break;
            }
        });

        // ✅ Display Branch Users Dynamically
        const branchData = resp.admin_report_stats.user_branch_count;
        let branchRowHtml = "";
        branchData.forEach(branch => {
            branchRowHtml += `
            <tr>
                <td>${branch.name}</td>
                <td>${branch.number_of_users}</td>
            </tr>
            `;
        });

        // Replace existing branch rows
        $("#branchUserRows").html(branchRowHtml);
        });
  });

});




function downloadCSV() {
  const token = sessionStorage.getItem("token");
  fetch("http://127.0.0.1:3000/api/v1/report/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token,
    },
    body: JSON.stringify({ document_type: "csv" }),
  })
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `users-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch((err) => console.error("CSV download error:", err));
}

function downloadPDF(htmlContent) {
  if (!htmlContent) return console.error("Empty PDF content.");
  const win = window.open("", "", "");
  win.document.write(htmlContent.html);
  win.document.close();
  win.print();
}
