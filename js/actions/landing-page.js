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

    $(document).on("click", "#loanPackages", function (e) {
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
    $("#loanPackagesRow").append(`
    <div class="col-md-4">
    <!-- Widget: user widget style 2 -->
    <div class="card card-widget widget-user-2 card-outline card-primary">
        <!-- Add the bg color to the header using any of the bg-* classes -->
        <div class="widget-user-header ">
            <!--<div class="widget-user-image">
                <img class="img-circle elevation-2" src="dist/img/mbi.jpg" alt="User Avatar">
            </div>-->
            <!-- /.widget-user-image -->
            <h3 class="widget-user-username text-weight-bold">${loan_package.name}</h3>
            <!--<h5 class="widget-user-desc">Lead Developer</h5>-->
        </div>
        <div class="card-footer p-0">
            <ul class="nav flex-column">
                <li class="nav-item">
                    <a href="#" class="nav-link text-secondary">
                        Maximum <span class="float-right badge  mb-1 ">MK${loan_package.max}</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link text-secondary">
                        Minimum <span class="float-right badge  mb-1">MK${loan_package.min}</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link text-secondary">
                        Rate <span class="float-right badge bg-primary mb-1">${loan_package.rate}%</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link text-secondary">
                        Period <span class="float-right badge mb-1">${loan_package.period}wks</span>
                    </a>
                </li>
            </ul>
        </div>
    </div>
    <!-- /.widget-user -->
</div>`);
}