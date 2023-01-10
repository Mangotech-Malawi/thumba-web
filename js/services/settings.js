import { apiClient } from "./api-client.js";

export function addScore(params) {
  return apiClient("/api/v1/score/new", "POST", "json", false, false, params);
}

export function editScore(params) {
  return apiClient("/api/v1/score/edit", "POST", "json", false, false, params);
}

export function calculateAutomaticScores(params) {
  return apiClient(
    "/api/v1/applications/calculate_risk",
    "GET",
    "json",
    false,
    false,
    params
  );
}

export function fetchManualScores(){
   return apiClient(
    "/api/v1/scores/manual",
    "GET",
    "json",
    false,
    false,
    {}
  );
}

export function fetchScoresNames() {
  return apiClient("/api/v1/score_names", "GET", "json", false, false, {});
}

export function fetchScores() {
  let data = apiClient("/api/v1/scores", "GET", "json", false, false, {});

  loadScores(data);
}

function loadScores(dataset) {
  $("#scoresTable").DataTable({
    destroy: true,
    responsive: true,
    searching: true,
    ordering: true,
    lengthChange: true,
    autoWidth: false,
    info: true,
    data: dataset,
    columns: [
      { data: "id" },
      { data: "code" },
      { data: "score_type" },
      { data: "description" },
      { data: "score" },
      { data: null },
      { data: null },
    ],
    columnDefs: [
      {
        render: getScoreUpdateBtn,
        data: null,
        targets: [5],
      },
      {
        render: getScoreDelBtn,
        data: null,
        targets: [6],
      },
    ],
  });
}

export function getScoreUpdateBtn(data, type, row, metas) {
  let dataFields = `data-score-id = "${data.id}"
                    data-code = "${data.code}"
                    data-name = "${data.name}"
                    data-description ="${data.description}"
                    data-score ="${data.score}"
                    data-action-type = "edit"`;

  return getButton(dataFields, "analysis-score", "default", "fas fa-edit");
}

export function getScoreDelBtn(data, type, row, metas) {
  let dataFields = `data-score-del-id = "${data.id}"
    data-action-type = "edit"`;

  return getButton(dataFields, "analysis-score", "danger", "fas fa-trash");
}

export function addGrade(params) {
  return apiClient("/api/v1/grade/new", "POST", "json", false, false, params);
}

export function editGrade(params) {
  return apiClient("/api/v1/grade/edit", "POST", "json", false, false, params);
}

export function fetchGrades() {
  let data = apiClient("/api/v1/grades", "GET", "json", false, false, {});

  loadGrades(data);
}

export function fetchGrade(params){
  let data = apiClient("/api/v1/analysis_grade", "GET", 
            "json", false, false, params);
  return data;
}

function loadGrades(dataset) {
  $("#gradesTable").DataTable({
    destroy: true,
    responsive: true,
    searching: true,
    ordering: true,
    lengthChange: true,
    autoWidth: false,
    info: true,
    data: dataset,
    columns: [
      { data: "id" },
      { data: "name" },
      { data: "maximum" },
      { data: "minimum" },
      { data: null },
      { data: null },
    ],
    columnDefs: [
      {
        render: getGradeUpdateBtn,
        data: null,
        targets: [4],
      },
      {
        render: getGradeDelBtn,
        data: null,
        targets: [5],
      },
    ],
  });
}

export function getGradeUpdateBtn(data, type, row, metas) {
  let dataFields = `data-grade-id = "${data.id}"
                      data-name     = "${data.name}"
                      data-maximum  = "${data.maximum}"
                      data-minimum  = "${data.minimum}"
                      data-action-type = "edit"`;
  return getButton(dataFields, "analysis-grade", "success", "fas fa-edit");
}

export function getGradeDelBtn(data, type, row, metas) {
  let dataFields = `data-grade-del-id = "${data.id}"
    data-action-type = "edit"`;
  return getButton(dataFields, "analysis-grade", "danger", "fas fa-trash");
}

function getButton(dataFields, modal, color, icon) {
  return `<button type='button' class="btn btn-block btn-${color}"
             data-toggle="modal" data-target="#modal-${modal}" ${dataFields} >
              <i class="${icon}" aria-hidden="true"></i></button>`;
}
