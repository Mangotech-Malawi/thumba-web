import { apiClient } from "./api-client.js";

export function fetchInterests(){
    let data = apiClient("/api/v1/interests", "GET", "json", false, false, {});

    if(data != null){
        populateInterestsTable(data);
    }
}

export function deleteInterest(interest_id){
    return apiClient("/api/v1/interests/delete", "POST", "json", 
                    false, false, {interest_id: interest_id});
}

export function editInterest(params){
    return apiClient("/api/v1/interests/edit", "POST", "json", 
                    false, false, params);
}

export function addInterest(params){
  return apiClient("/api/v1/interests/new", "POST", "json", 
  false, false, params);
}



function populateInterestsTable(dataSet){
    $("#interestsTable").DataTable({
        destroy: true,
        responsive: true,
        searching: true,
        ordering: true,
        lengthChange: true,
        autoWidth: false,
        info: true,
        data: dataSet,
        columns: [
            { data: "id" },
            { data: "name"},
            { data: "max" },
            { data: "min" },
            { data: "rate"},
            { data: "accum_amount" },
            { data: "period" },
            { data: "grace_period"},
            { data: "accum_days"},
            { data: null },
            { data: null }
          ],
          columnDefs: [
            {
              render: getEditButton,
              data: null,
              targets: [9],
            },
            {
              render: getDelButton,
              data: null,
              targets: [10],
            },
          ],
    });
}

function getEditButton(data, type, row, meta){
    return `<button  type="button"  class="btn btn-default"
    data-toggle="modal" data-target = "#modal-interest"
    data-interest-id = "${data.id}"
    data-name  = "${data.name}" 
    data-max  = "${data.max}" 
    data-min = "${data.min}"
    data-rate = "${data.rate}"
    data-accum-amount = "${data.accum_amount}"
    data-period = "${data.period}"
    data-grace-period ="${data.grace_period}"
    data-accum-days ="${data.accum_days}"
    data-action-type = "edit">
   <i class="fas fa-edit"></i></button>`;
}

function getDelButton(data, type, row, meta) {
    return `<button  type="button"  class="btn btn-danger"
      data-toggle="modal" data-target = "#modal-del-interest"
      data-del-interest-id = "${data.id}">
     <i class="fas fa-trash"></i></button>`;
  }
  