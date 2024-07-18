import * as loans from "../services/loans.js";
import * as settings from "../services/settings.js";
import { automaticScoreOptions } from "../services/chartsOptions/automatic_score.js";
import { manualScoreOptions } from "../services/chartsOptions/manual_score.js";
import { riskResultOptions } from "../services/chartsOptions/risk_results.js";
import {
  validateAnalysisScoreNameForm, validateAnalysisScoreForm,
  validateGradeForm, validateDTIRatioForm
} from "../utils/forms.js";
import { loadContent } from "./contentLoader.js";

const scoresModal = "#modal-analysis-score";
const gradesModal = "#modal-analysis-grade";
const scoreNameModal = "#modal-analysis-score-name";
const dtiRatioModal = "#modal-dti-ratios";
let totalManualScore = 0.0;
let totalAutomaticScore = 0.0;
let availableManualScore = 0.0;
let availableAutomaticScore = 0.0;
let selectedManualScoreIds = new Array();
let totalScore = 0.0;
let risk_percentage = 0.0;
let gradeId;
let loanApplicationId;

$(function () {
  //Resetting manual score to zero

  $(document).on("click", ".view-risk-calculator", function (e) {
    e.preventDefault();
    
    totalManualScore = 0.0;
    availableManualScore = 0.0;
    risk_percentage = 0.0;
    totalManualScore = 0.0;
    selectedManualScoreIds = new Array();

    loanApplicationId = $(this).data().loanApplicationId;

    $.when(loadRecord("views/settings/risk_calculator.html", "risk_calculator")).done(function (){
      let automaticScores = settings.calculateAutomaticScores({
        loan_application_id: loanApplicationId,
      });

      createManualScoresCheckBoxes(settings.fetchManualScores());
      populateAutomaticScoreChart(automaticScores);
      updateManualScoreChart(totalManualScore);
      updateRiskResultsChart();
      updateGradesLabel();
    });


  });

  $(document).on("show.bs.modal", scoreNameModal, function (e) {
    let opener = e.relatedTarget;

    if ($(opener).attr("data-action-type") == "edit") {
      $(scoreNameModal).find(`[id = 'scoreNameModalTitle']`).text("Edit Score Name");
      $.each(opener.dataset, function (key, value) {
        $(scoreNameModal).find(`[id = '${key}']`).val(value);
      });
    } else {
      $(scoreNameModal).find(`[id = 'scoreNameModalTitle']`).text("Add Score Name");
    }
  });

  $(document).on("show.bs.modal", dtiRatioModal, function (e) {
    let opener = e.relatedTarget;

    clearFields("#dtiRatioForm");

    $.when(settings.fetchDTIScoreNames()).done(function (score_names) {
      $.when(populateDTIRatioScoreNames(score_names)).done(function () {
        if ($(opener).attr("data-action-type") == "edit") {
          $(dtiRatioModal).find(`[id = 'dtiRatioModalTitle']`).text("Edit DTI Ratio");

          $.each(opener.dataset, function (key, value) {
            $(dtiRatioModal).find(`[id = '${key}']`).val(value);
          });
        } else {
          $(dtiRatioModal).find(`[id = 'dtiRatioModalTitle']`).text("Add DTI Ratio");
        }
      });
    })


  });

  $(document).on("show.bs.modal", scoresModal, function (e) {
    let opener = e.relatedTarget;

    if ($(opener).attr("data-action-type") == "edit") {
      $(scoresModal).find(`[id = 'scoreModalTitle']`).text("Edit Score");

      let code = $(opener).attr("data-code");
      let id = $(opener).attr("data-score-id");
      let description = $(opener).attr("data-description");

      //Populating score names multiselect
      populateScoreNames(
        new Array({
          id: id,
          code: code,
          description: description,
        })
      );

      $.each(opener.dataset, function (key, value) {
        $(scoresModal).find(`[id = '${key}']`).val(value);
      });
    } else {
      $(scoresModal).find(`[id = 'scoreModalTitle']`).text("Add Score");
      //Populating score names multiselect
      populateScoreNames(settings.fetchScoresNames());
    }
  });

  $(document).on("change", ".manual-score-chkbox", function (e) {
    if (this.checked) {
      totalManualScore = parseFloat(totalManualScore) + parseFloat(this.value);
      selectedManualScoreIds.push(parseInt(this.dataset.id));
    } else {
      totalManualScore = parseFloat(totalManualScore) - parseFloat(this.value);
      selectedManualScoreIds.splice(
        selectedManualScoreIds.indexOf(parseInt(this.dataset.id)),
        1
      );
    }

    totalManualScore = parseFloat(Number(totalManualScore).toFixed(1));
    updateManualScoreChart(totalManualScore);
    updateRiskResultsChart();
    updateGradesLabel();
  });

  $(document).on("click", "#saveScoreNameBtn", function () {
    if (validateAnalysisScoreNameForm()) {
      if ($("#scoreNameModalTitle").text() === "Add Score Name") {
        notification(
          settings.addScoreName(scoreNameParams()).created,
          "center",
          "success",
          "score_name",
          "Add Analysis Score Name",
          "Analyisis score name has been added successfully",
          true,
          3000
        );
      } else if ($("#scoreNameModalTitle").text() === "Edit Score Name") {
        notification(
          settings.editScoreName(scoreNameParams()).updated,
          "center",
          "success",
          "score_name",
          "Edit Analysis Score Name",
          "Analysis score name has been updated successfully",
          true,
          3000
        );
      }
    }

  });

  $(document).on("click", "#saveDtiRatioBtn", function () {
    if (validateDTIRatioForm()) {

      if ($("#dtiRatioModalTitle").text() === "Add DTI Ratio") {
        notification(
          settings.addDTIRatio(DTIRatioParams()).created,
          "center",
          "success",
          "dti_ratio",
          "Add DTI Ratio",
          "DTI Ratio has been added successfully",
          true,
          3000
        );
      } else if ($("#dtiRatioModalTitle").text() === "Edit DTI Ratio") {
        notification(
          settings.editDTIRatio(DTIRatioParams()).updated,
          "center",
          "success",
          "dti_ratio",
          "Edit DTI Ratio",
          "DTI Ratio has been updated successfully",
          true,
          3000
        );
      }
    }
  });

  $(document).on("click", "#saveScoreBtn", function () {
    if (validateAnalysisScoreForm()) {
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
          settings.editScore(scoreParams()).updated,
          "center",
          "success",
          "score",
          "Edit Analysis Score",
          "Analysis score has been updated successfully",
          true,
          3000
        );
      }
    }

  });

  $(document).on("show.bs.modal", gradesModal, function (e) {
    let opener = e.relatedTarget;

    if ($(opener).attr("data-action-type") == "edit") {
      $(gradesModal).find(`[id = 'gradesModalTitle']`).text("Edit Grade");
      $.each(opener.dataset, function (key, value) {
        $(gradesModal).find(`[id = '${key}']`).val(value);
      });
    } else {
      $(gradesModal).find(`[id = 'gradesModalTitle']`).text("Add Grade");
    }
  });

  $(document).on("click", "#saveGradeBtn", function () {
    if (validateGradeForm()) {
      if ($("#gradesModalTitle").text() === "Add Grade") {
        notification(
          settings.addGrade(gradeParams()).created,
          "center",
          "success",
          "grade",
          "Add Analysis Grade",
          "Analyisis grade has been added successfully",
          true,
          3000
        );
      } else if ($("#gradesModalTitle").text() === "Edit Grade") {
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
    }

  });

  $(document).on("click", "#saveLoanAnalyisBtn", function () {
    notification(
      settings.addAnalysis({
        loan_application_id: loanApplicationId,
        grade_id: gradeId,
        score_ids: selectedManualScoreIds,
      }).created,
      "center",
      "success",
      "analysis",
      "Record loan application analysis",
      "Analysis has been done successfully",
      true,
      3000
    );
  });
});


function scoreNameParams() {
  let scoreNameId = $("#scoreNameId").val();
  let shortCode = $("#scoreCode").val(); //Has value when updating scores
  let scoreType = $("#scoreType").val();
  let description = $("#scoreDescription").val();

  let params = {
    score_name_id: scoreNameId,
    code: shortCode,
    score_type: scoreType,
    description: description,
  };

  return params;
}

function DTIRatioParams() {
  let dtiRatioId = $("#dtiRatioId").val();
  let scoreNameId = $("#dtiScoreNames").val();
  let minRatio = $("#minRatio").val();
  let maxRatio = $("#maxRatio").val();

  let params = {
    id: dtiRatioId,
    score_name_id: scoreNameId,
    min_ratio: minRatio,
    max_ratio: maxRatio
  }

  return params;
}

function scoreParams() {
  let scoreId = $("#scoreId").val(); //Has value when updating scores
  let scoreNameId = $("#scoreName").val();
  let score = $("#score").val();

  let params = {
    score_id: scoreId,
    score_name_id: scoreNameId,
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

function populateAutomaticScoreChart(automatic_score) {
  automaticScoreOptions.series[0] = automatic_score.score_percentage;

  let automaticScoreChart = new ApexCharts(
    document.querySelector("#automatic-score-chart"),
    automaticScoreOptions
  );

  automaticScoreChart.render();

  availableAutomaticScore = automatic_score.total_available_score;
  totalAutomaticScore = automatic_score.score;

  $(".available-score").text(availableAutomaticScore);
  $("#analysis-score").text(automatic_score.score);
  $("#analysis-score-percentage").text(`${automatic_score.score_percentage}%`);
  $("#installment-amount").text(`MWK${automatic_score.installment_amount}`);
  $("#monthly-salary").text(`MWK${automatic_score.total_monthly_salary}`);
  $("#dependants-expense").text(`MWK${automatic_score.total_monthly_dependants_expenses}`
  );
  $("#monthly-otherloans").text(`MWK${automatic_score.total_monthly_otherloans}`);
  $("#business-profits").text(`MWK${automatic_score.total_monthly_business_profits}`);

  selectedManualScoreIds.push(automatic_score.score_id);
}

function updateManualScoreChart(score) {
  $("#manual-score-chart").html("");
  manualScoreOptions.series[0] = (score * 100) / availableManualScore;

  let manualScoreChart = new ApexCharts(
    document.querySelector("#manual-score-chart"),
    manualScoreOptions
  );

  manualScoreChart.render();
}

function updateRiskResultsChart() {
  $("#risk-result-chart").html("");
  risk_percentage =
    100.0 -
    parseFloat(
      Number(
        ((totalManualScore + totalAutomaticScore) * 100) /
        (availableAutomaticScore + availableManualScore)
      ).toFixed(1)
    );

  riskResultOptions.series[0] = risk_percentage;

  let automatedScoreChart = new ApexCharts(
    document.querySelector("#risk-result-chart"),
    riskResultOptions
  );

  automatedScoreChart.render();
}

function updateGradesLabel() {
  let grade = settings.fetchGrade({ risk_percentage: risk_percentage });
  gradeId = grade[0].id;
  $("#loan-risk-grade").text(grade[0].name);
  $("#loan-risk-grade-range").text(
    `${grade[0].minimum} - ${grade[0].maximum}  `
  );
}

function populateScoreNames(scoreNames) {
  let scoreNamesArray = [];

  scoreNames.forEach(function (scoreName, index) {
    availableManualScore = scoreNamesArray.push(
      '<option value ="',
      scoreName.id,
      '">',
      `${scoreName.code} | ${scoreName.description}`,
      "</option>"
    );
  });

  $("#scoreName").html(scoreNamesArray.join(""));
}

function populateDTIRatioScoreNames(scoreNames) {
  let scoreNamesArray = [];

  scoreNames.forEach(function (scoreName, index) {
    availableManualScore = scoreNamesArray.push(
      '<option value ="',
      scoreName.id,
      '">',
      `${scoreName.code} | ${scoreName.description}`,
      "</option>"
    );
  });

  $("#dtiScoreNames").html(scoreNamesArray.join(""));
}

function createManualScoresCheckBoxes(scores) {
  $("#scores-checkbox-row").html("");
  scores.forEach(function (score, index) {
    $("#scores-checkbox-row").append(
      '<div class="col-lg-6 col-sm-6">' +
      '<div class="card "><div class="card-body">' +
      '<div class="icheck-primary  icheck-inline ">' +
      '<input class="manual-score-chkbox" type="checkbox" value="' +
      score.score +
      '" id="' +
      score.id +
      score.code +
      '" data-id ="' +
      score.id +
      '" /><label for="' +
      score.id +
      score.code +
      '">' +
      score.code +
      "</label></div></div></div></div"
    );

    availableManualScore += score.score;
  });
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
        case "score_name":
          $.when(settings.fetchScoresNames()).done(function () {
            $(scoreNameModal).modal("hide");
          });
          break;
        case "score":
          $.when(settings.fetchScores()).done(function () {
            $(scoresModal).modal("hide");
          });
          break;
        case "dti_ratio":
          $.when(settings.fetchDTIRatios()).done(function () {
            $(dtiRatioModal).modal("hide");
          });
          break;
        case "grade":
          $.when(settings.fetchGrades()).done(function () {
            $(gradesModal).modal("hide");
          });
          break;
        case "analysis":
          $.when(loans.fetchLoanApplications({ status_name: "NEW" })).done(function () {
            $(riskCalculatorModal).modal("hide");
          });
          break;
      }
    });
}

function clearFields(formId) {
  $(":input", formId).not(":button, :submit, :reset").val("").prop("checked", false).prop("selected", false);
}

function loadRecord(path, state) {
  $.when(loadContent("mainContent", state, path)).done(function () { });
}

