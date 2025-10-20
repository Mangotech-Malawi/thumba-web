import * as report from "../services/reports.js";
import * as contentLoader from "../actions/contentLoader.js";

$(function () {
  const tabLoaders = {
    "loan-reports": () => {
      $.when(contentLoader.loadContent("loan-reports", "reports", "views/reports/loans.html"))
        .done(() => report.loanOfficer());
    },
    "finance-reports": () => {
      $.when(contentLoader.loadContent("finance-reports", "reports", "views/reports/finance.html"))
        .done(() => report.finance());
    },
    "shares-reports": () => {
      $.when(contentLoader.loadContent("shares-reports", "reports", "views/reports/shares.html"))
        .done(() => report.shares());
    },
    "admin-reports": () => {
      $.when(contentLoader.loadContent("admin-reports", "reports", "views/reports/admin.html"))
        .done(() => report.admin());
    },
    "system-reports": () => {
      $.when(contentLoader.loadContent("system-reports", "reports", "views/reports/superuser.html"))
        .done(() => console.log("System-level reports loaded."));
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