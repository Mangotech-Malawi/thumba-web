import * as dashboard from "../services/dashboard.js";
import * as contentLoader from "../actions/contentLoader.js";

$(function () {

    $(document).on("click", "#loan-dashboard", function () {
        $.when(contentLoader.loadContent("loans-dashboard", "dashboard", "views/dashboards/loan-officer.html")).done(function () {
            dashboard.loanOfficer();
        });
    });

    $(document).on("click", "#finance-dashboard", function () {
        $.when(contentLoader.loadContent("finance-performance", "dashboard", "views/dashboards/finance.html")).done(function () {
            dashboard.loanOfficer();
        });
    });

    $(document).on("click", "#system-adminstration-dashboard", function () {
        $.when(contentLoader.loadContent("system-admin", "dashboard", "views/dashboards/admin.html")).done(function () {
            dashboard.admin();
        });
    });

    $(document).on("click", "#loan-officer-dashboard", function () {

    });

});