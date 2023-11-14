import { loadContent } from "../actions/contentLoader.js";
import { content_view } from "../app-views/content.js";
import { fetchLoanPackages } from "../services/interests.js";

const homeContent = "homeContent"
let state = localStorage.getItem("homeState");

if (typeof state != undefined && state != null)
    selectContent(state);
else
    selectContent("home")


$(function () {
    $(document).on("click", ".home", function (e) {
        selectContent("home");
    });

    $(document).on("click", ".loanPackages", function (e) {
        selectContent("loan_packages");
    });

    $(document).on("click", "#investmentPackages", function (e) {
        selectContent("thumba_investment_packages");
    });

    $(document).on("click", "#forms", function (e) {
        selectContent("forms");
    });

    $(document).on("click", "#aboutUs", function (e) {
        selectContent("about_us");
    });

    $(document).on("click", "#faq", function (e) {
        selectContent("faq");
    });
});

export function selectContent(state) {
    for (let index = 0; index < content_view.length; index++) {
        if (state === content_view[index].state) {
            loadOtherContent(state, index)
            break;
        }
    }
}

function loadOtherContent(state, index) {
    $("#loanPackagesRow").html("");
    $.when(loadContent(homeContent, state, content_view[index].link, "homeState")).done(
        function () {
            if (state === "loan_packages") {
                $.when(fetchLoanPackages()).done(function (loanPackages) {
                    loanPackages.forEach(function (loanPackage, index) {
                        appendLoanPackage(loanPackage)
                    })
                })
            }
        }
    )
}

function appendLoanPackage(loan_package) {
    console.log("dsdsds");
    $("#loanPackagesRow").append(`
    <div class="col-lg-4 col-md-6 col-sm-12">
        <div class="single_service wow fadeInLeft" data-wow-duration="1.2s" data-wow-delay=".5s">
            <div class="service_icon_wrap text-center">
                <div class="service_icon ">
                    <img src="img/svg_icon/service_1.png" alt="">
                </div>
            </div>
            <div class="info text-center">
                <span>${loan_package.name}</span>
                <h3>MK${loan_package.min} - MK${loan_package.max}</h3>
            </div>
            <div class="service_content">
                <ul>
                    <li>${loan_package.rate}%</li>
                    <li>${loan_package.period}wks</li>

                </ul>
                <div class="apply_btn">
                    <button class="boxed-btn3 loan-form" type="submit">Download Form</button>
                </div>
            </div>
        </div>
    </div>`);
}