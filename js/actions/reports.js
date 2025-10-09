import * as report from "../services/reports.js"
import * as contentLoader from "../actions/contentLoader.js";

$(function () {
    const tabLoaders = {
        "loan-reports": () => {
            $.when(contentLoader.loadContent("loans-reports", "reports", "views/reports/loan-officer.html"))
                .done(() => report.loanOfficer());
        },
        "finance-reports": () => {
            $.when(contentLoader.loadContent("finance-reports", "reports", "views/reports/finance.html"))
                .done(() => report.finance());
        },
        "system-admin-reports": () => {
            $.when(contentLoader.loadContent("system-admin-reports", "reports", "views/reports/admin.html"))
                .done(() => report.admin());
        },
        "system-reports-main": () => {
            $.when(contentLoader.loadContent("system-reports-main", "reports", "views/reports/superuser.html"))
                .done(() => console.log("Super user reports"));
        },
        "shares-reports": () => {
            $.when(contentLoader.loadContent("shares-reports", "reports", "views/reports/shares.html"))
                .done(() => report.shares());
        }
    };

    // Register clicks
    Object.entries(tabLoaders).forEach(([id, handler]) => {
        $(document).on("click", `#${id}`, handler);
    });

    // Auto-load from localStorage (in case Alpine sets it)
    const firstTabId = localStorage.getItem("reports_first_tab");
    if (firstTabId && tabLoaders[firstTabId] && localStorage.getItem("state") === "reports") {
        tabLoaders[firstTabId]();
    }

     $(document).on("click", ".users-report-btn", function (e) {
        e.preventDefault();
        let documentType = $(this).data().documentType;

        if (documentType === "csv") {
            downloadCSV();
        } else {
            $.when(report.users({ document_type: documentType })).done(
                function (data) {
                    downloadPDF(data);
                }
            );
        }
    });
});


function downloadCSV() {
    let token = sessionStorage.getItem("token");

    // Send POST request to the backend
    fetch('http://127.0.0.1:3000/api/v1/report/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ document_type: "csv"})

    })
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `users-${new Date().toISOString().slice(0, 10)}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch(error => console.error('Error:', error));
}


function downloadPDF(htmlContent) {
    if (htmlContent) {
        let win = window.open("", "", "");
        win.document.write(htmlContent.html)
        win.document.close();
        win.print();
    } else {
        console.error("HTML content is null or empty.")
    }
}
