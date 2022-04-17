import * as interest from "../services/interests.js";
import {notify} from "../services/utils.js";


const modalId = "#modal-interest";
const delModalId = "#modal-del-interest";
$(function (){
    $(document).on("show.bs.modal", modalId, function (e){
        let opener = e.relatedTarget;

        if ($(opener).attr("data-action-type") === "edit") {
           
            $(modalId).find(`[id = 'interestModalTitle']`)
                      .text("Edit Interest");
            
            $.each(opener.dataset, function (key, value) {
                $(modalId).find(`[id = '${key}']`).val(value);
             }); 

        }else{
            $(modalId).find(`[id = 'interestModalTitle']`)
                      .text("Add Interest");
        }
    });

    $(document).on("show.bs.modal", delModalId, function (e){
        $(delModalId).find(`[id = 'delInterestId']`)
                            .val($(e.relatedTarget)
                            .attr("data-del-interest-id")
                            );
    });


    $(document).on("click", "#saveInterestBtn", function(){
        let id = $("#interestId").val();
        let name = $("#name").val();
        let max = $("#max").val();
        let min = $("#min").val();
        let rate = $("#rate").val();
        let period = $("#period").val();
        let accum_amount = $("#accumAmount").val();
        let grace_period = $("#gracePeriod").val();
        let accum_days = $("#accumDays").val();
        
        let params = {
            interest_id: id,
            name: name,
            max: max,
            min: min,
            rate: rate,
            period: period,
            accum_amount: accum_amount,
            grace_period: grace_period,
            accum_days: accum_days
        }


        if ($("#interestModalTitle").text() === "Edit Interest") {
            let resp = interest.editInterest(params);
            
            if(resp.updated){
                $.when(notify("center", "success", "Edit Interest",
                "Client updated successfully",
                 false, 1500)
                ).done(function(){
   
                    $.when(interest.fetchInterests()).done(function(){
                        $(modalId).modal('hide');
                    });
                });
            }
        }else{
           // interest.addInterest(params);
        }
       
    });

    $(document).on("click", "#delInterestBtn", function (e){
        let id = $("#delInterestId").val();

        let resp = interest.deleteInterest(id);
        if (resp.deleted){

            notify("center", "success", "Delete Interest",
             "interest has been deleted successfully",
              false, 1500);

            $(delModalId).modal('hide');
            interest.fetchInterests();
        }
    });
    
    
});

