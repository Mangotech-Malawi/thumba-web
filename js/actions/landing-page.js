import { loadContent } from "../actions/contentLoader.js";
import { content_view } from "../app-views/content.js";
import { fetchLoanPackages } from "../services/interests.js";
import { fetchInvestimentPackages } from "../services/investments.js";

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

    $(document).on("click", ".investmentPackages", function (e) {
        selectContent("thumba_investment_packages");
    });


    $(document).on("click", ".about-link", function (e) {
        selectContent("about_us");
    });

    $(document).on("click", ".contact-link", function (e) {
        selectContent("contact_us");
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
   
    $.when(loadContent(homeContent, state, content_view[index].link, "homeState")).done(
        function () {
            if (state === "loan_packages") {
                $("#loanPackagesRow").html("");
                $.when(fetchLoanPackages()).done(function (loanPackages) {
                    loanPackages.forEach(function (loanPackage, index) {
                        appendLoanPackage(loanPackage)
                    })
                })
            } else if ( state === "thumba_investment_packages"){
                $("#investmentPackagesRow").html("");
                $.when(fetchInvestimentPackages("load-none")).done(function (investmentPackages) {
                    investmentPackages.forEach(function (investmentPackage, index) {
                        appendInvestmentPackage(investmentPackage)
                    })
                })
            }
        }
    )
}

function appendLoanPackage(loan_package) {
  
    $("#loanPackagesRow").append(`
    <div class="col-lg-4 col-md-6 col-sm-12">
        <div class="single_service wow fadeInLeft" data-wow-duration="1.2s" data-wow-delay=".5s">
            <div class="service_icon_wrap text-center">
                <div class="service_icon ">
                    <img src="/site/img/svg_icon/service_1.png" alt="">
                </div>
            </div>
            <div class="info text-center">
                <span><h4 class="text-white">${loan_package.name}</h4></span>
                <h3 class="text-weight-bold">MK${loan_package.min} - MK${loan_package.max}</h3>
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

function appendInvestmentPackage(investment_package){
    $("#investmentPackagesRow").append(`
    <div class="col-lg-4 col-md-6 col-sm-12">
        <div class="single_service wow fadeInLeft" data-wow-duration="1.2s" data-wow-delay=".5s">
            <div class="service_icon_wrap text-center">
                <div class="service_icon ">
                    <img src="/site/img/svg_icon/service_1.png" alt="">
                </div>
            </div>
            <div class="info text-center">
                <span><h4 class="text-white">${investment_package.package_name}</h4></span>
                <h3 class="text-weight-bold">MK${investment_package.min_amount} - MK${investment_package.max_amount}</h3>
            </div>
            <div class="service_content">
                <ul>
                    <li>${investment_package.interest_rate}% Return Rate</li>
                    <li>${investment_package.interest_frequency} returns frequency</li>
                    <li>${investment_package.currency} Currency</li>
                    <li>${investment_package.duration} months</li>
                    <li>${investment_package.risk_level} risk</li>
                </ul>
                <div class="apply_btn">
                    <button class="boxed-btn3 investor-form" type="submit">Download Form</button>
                </div>
            </div>
        </div>
    </div>`);
}