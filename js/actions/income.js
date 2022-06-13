import * as users from "../services/users.js";
import * as income from "../services/income.js";
import { notify } from "../services/utils.js";

const modalId = "#modal-income";

$(function () {
  $(document).on("show.bs.modal", modalId, function (e) {
    let data = users.fetchUsers();
    let opener = e.relatedTarget;

    let investors = [];

    if (data !== null) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].role === "investor" || data[i].role === "co-owner") {
          console.log(data.role);
          investors.push(
            '<option value ="',
            data[i].id,
            '">',
            data[i].firstname,
            "</option>"
          );
        }

        $("#investorId").html(investors.join(""));
      }
    }

    if ($(opener).attr("data-button-type") === "edit") {

    }else{
        $(modalId).find(`[id = 'incomeModalTitle']`).text("Add Income");
    }


  });

  $(document).on("click", "#saveIncomeBtn", function (e) {
    let id = $("#incomeId").val();
    let amount = $("#amount").val();
    let category = $("#category").val();
    let investorId = $("#investorId").val();
    let description = $("#description").val();

    let params = {
        id: id,
        amount: amount,
        category: category,
        user_id: investorId,
        description: description
    }

    if ($("#incomeModalTitle").text() === "Edit Income") {

    }else{
        income.add(params)
    }




  });
});
