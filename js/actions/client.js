import * as client from "../services/clients.js";
import {notify} from "../services/utils.js";

let modalId = "#modal-register-client";

$(function () {
  $(document).on("show.bs.modal", modalId, function (e) {
    let opener = e.relatedTarget;

    if ($(opener).attr("data-action-type") === "edit") {
      $(modalId).find(`[id = 'regModalTitle']`).text("Edit Client");
      $.each(opener.dataset, function (key, value) {
        $(modalId).find(`[id = '${key}']`).val(value);
      });
    } else {
      $(modalId).find(`[id = 'regModalTitle']`).text("Add Client");
    }
  });

  $(document).on("show.bs.modal", "#modal-del-client", function (e){
      $("#modal-del-client").find(`[id = 'delClientId']`)
                            .val($(e.relatedTarget)
                            .attr("data-id")
                            );
  });

  $(document).on("click", "#delClientBtn", function (e){
      let id = $("#delClientId").val();
      let void_reason    = $("#reason").val();
      
      client.delClient(id, void_reason);
  });

  $(document).on("click", "#registerBtn", function (e) {
    let user_id = $("#userId").val();
    let national_id = $("#nationalId").val();
    let firstname = $("#firstname").val();
    let lastname = $("#lastname").val();
    let gender = $("#gender option:selected").val();
    let date_of_birth = $("#dateOfBirth").val();
    let home_district = $("#homeDistrict option:selected").val();
    let home_ta = $("#homeTa").val();
    let home_village = $("#homeVillage").val();
    let current_district = $("#currentDistrict option:selected").val();
    let current_ta = $("#currentTa").val();
    let current_village = $("#currentVillage").val();
    let nearest_landmark = $("#nearest_landmark option:selected").val();
  
    let params = {
      id: user_id,
      national_id: national_id,
      firstname: firstname,
      lastname: lastname,
      gender: gender,
      date_of_birth: date_of_birth,
      home_district: home_district,
      home_ta: home_ta,
      home_village: home_village,
      current_district: current_district,
      current_ta: current_ta,
      current_village: current_village,
      nearest_landmark: nearest_landmark,
   
    };

    if ($("#regModalTitle").text() === "Edit Client") {

      let resp = client.editClient(params);
      if(resp.updated){
        $.when(notify("center", "success", "Edit Client",
             "Client has been updated successfully",
              false, 1500)
             ).done(function(){

          $.when(client.fetchClientsData()).done(function(){
            $(modalId).modal('hide');
          });
    
        });
      
       
      }
    } else {
      client.addClient(params);
    }
  });
});
