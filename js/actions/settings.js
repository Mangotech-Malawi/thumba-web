import * as settings from "../services/settings.js";
import { automaticScoreOptions } from "../services/chartsOptions/automatic_score.js";

const scoresModal = "#modal-analysis-score";
const gradesModal = "#modal-analysis-grade";
const riskCalculatorModal = "#modal-risk-calculator";


$(function () {

  $(document).on("show.bs.modal", riskCalculatorModal, function (e) {
    let opener = e.relatedTarget;
    let loanApplicationId = $(opener).attr("data-loan-application-id");

    let  automaticScores =  settings.calculateAutomaticScores({
                                loan_application_id: loanApplicationId,
                               });

                               
    
    populateAutomaticScoreChart(automaticScores);


  });

  $(document).on("show.bs.modal", scoresModal, function (e) {
    let opener = e.relatedTarget;

    if ($(opener).attr("data-action-type") == "edit") {
      $(scoresModal).find(`[id = 'scoreModalTitle']`).text("Edit Score");
      $.each(opener.dataset, function (key, value) {
        $(scoresModal).find(`[id = '${key}']`).val(value);
      });
    } else {
      $(scoresModal).find(`[id = 'scoreModalTitle']`).text("Add Score");
    }
  });

  $(document).on("click", "#saveScoreBtn", function () {
    if ($("#scoreModalTitle").text() === "Add Score") {
      notification(
        settings.addScore(scoreParams()).created,
        "center",
        "success",
        "score",
        "Add Analysis Score",
        "Analyisis score has been added successfully",
        true,
        3000
      );
    } else if ($("#scoreModalTitle").text() === "Edit Score") {
      notification(
        seetings.editScore(scoreParams()).updated,
        "center",
        "success",
        "score",
        "Edit Analysis Score",
        "Analysis score has been updated successfully",
        true,
        3000
      );
    }
  });

  $(document).on("show.bs.modal", gradesModal, function (e) {
    let opener = e.relatedTarget;

    if ($(opener).attr("data-action-type") == "edit") {
      $.each(opener.dataset, function (key, value) {
        $(gradesModal).find(`[id = '${key}']`).val(value);
      });
    } else {
      $(gradesModal).find(`[id = 'gradesModalTitle']`).text("Add Grade");
    }
  });

  $(document).on("click", "#saveGradeBtn", function () {
    if ($("#gradeModalTitle").text() === "Add Grade") {
      notification(
        settings.editGrade(gradeParams()).created,
        "center",
        "success",
        "grade",
        "Add Analysis Grade",
        "Analyisis grade has been added successfully",
        true,
        3000
      );
    } else if ($("#gradeModalTitle").text() === "Edit Grade") {
      notification(
        settings.editGrade(gradeParams()).updated,
        "center",
        "success",
        "grade",
        "Edit Analysis Grade",
        "Analysis grade has been updated successfully",
        true,
        3000
      );
    }
  });
});

function scoreParams() {
  let scoreId = $("#scoreId").val();
  let code = $("#code").val();
  let name = $("#name").val();
  let description = $("#description").val();
  let score = $("#score").val();

  let params = {
    score_id: scoreId,
    code: code,
    name: name,
    description: description,
    score: score,
  };

  return params;
}

function gradeParams() {
  let gradeId = $("#gradeId").val();
  let name = $("#name").val();
  let minimum = $("#minimum").val();
  let maximum = $("#maximum").val();

  let params = {
    grade_id: gradeId,
    name: name,
    minimum: minimum,
    maximum: maximum,
  };

  return params;
}

function populateAutomaticScoreChart(automatic_score){
  automaticScoreOptions.series[0] = automatic_score.score_percentage
  
  let automaticScoreChart = new ApexCharts(
    document.querySelector("#automatic-score-chart"),
    automaticScoreOptions
  )

  automaticScoreChart.render();
}

function notification(
  isDone,
  position,
  icon,
  recordType,
  title,
  text,
  showConfirmButton,
  timer
) {
  if (isDone)
    $.when(
      Swal.fire({
        position: position,
        icon: icon,
        title: title,
        text: text,
        showConfirmButton: showConfirmButton,
        timer: timer,
      })
    ).done(function () {
      switch (recordType) {
        case "score":
          $.when(loans.fetchScores()).done(function () {
            $(scoreModal).modal("hide");
          });
          break;
        case "grade":
          $.when(settings.fetchGrades()).done(function () {
            $(gradeModal).modal("hide");
          });
          break;
      }
    });
}
