import * as client from "../services/clients.js";
import * as form from "../utils/forms.js";
import * as contentLoader from "../actions/contentLoader.js";

const assetModal = "#modal-client-asset";
let currentDataset = null;
localStorage;

$(function () {

    if (localStorage.getItem("clientDataSet") != null) {
        currentDataset = JSON.parse(localStorage.getItem("clientDataSet"));
    }

    $(document).on("click", "#btnAssets", function (e) {
        $.when(contentLoader.loadIndividualRecordView("views/clients/assets.html", "assets")).done(
            function () {
                $("#recordName").text(
                    `${currentDataset.recordFirstname} ${currentDataset.recordLastname} Assets`
                );

                client.fetchClientAssets({
                    client_id: currentDataset.recordId,
                });
            }
        );
    });

    $(document).on("click", "#assetFormBtn", function (e) {
        $.when(contentLoader.loadIndividualRecordView("views/forms/asset.html", "asset_form")).done(
            function () {
                
            }
        );
    });

    //Client Assets
    $(document).on("click", "#saveAssetBtn", function (e) {
        if (form.validAssetFormData()) {
            if ($("#formTitle").text() === "Add Client Asset") {
                notification(
                    client.addAsset(clientAssetParams()).created,
                    "center",
                    "success",
                    "asset",
                    "Add Client Asset",
                    "Client Asset has been added successfully",
                    true,
                    3000
                );
            } else if ($("#formTitle").text() === "Edit Client Asset") {
                notification(
                    client.updateAsset(clientAssetParams()).updated,
                    "center",
                    "success",
                    "asset",
                    "Edit Client Asset",
                    "Client Asset has been updated successfully",
                    true,
                    3000
                );
            }
        }
    });

    $(document).on("click", "", function (e) {
        clearFields();
        let opener = e.relatedTarget;
        let actionType = $(opener).attr("data-action-type");

        if (actionType === "add") {
            $("#regAssetTitle").text("Add Client Asset");
        } else if (actionType === "edit") {
            $("#regAssetTitle").text("Edit Client Asset");
            $.each(opener.dataset, function (key, value) {
                $(assetModal).find(`[id = '${key}']`).val(value);
            });
        }
    });

    $(document).on("show.bs.modal", "#modal-del-client-asset", function (e) {
        let opener = e.relatedTarget;
        $.each(opener.dataset, function (key, value) {
            $("#modal-del-client-asset").find(`[id = '${key}']`).val(value);
        });
    });

    $(document).on("click", "#delClientAssetBtn", function (e) {
        let id = $("#delAssetId").val();
        $.when(
            notification(
                client.delAsset(id).deleted,
                "center",
                "success",
                "asset",
                "Delete Client Asset",
                "Client Asset has been deleted successfully",
                true,
                3000
            )
        ).done(function () {
            $("#modal-del-client-asset").modal("hide");
        });
    });


});


//Params Methods ====================+++>
function clientAssetParams() {
    let id = $("#clientAssetId").val();
    let identifier = $("#identifier").val();
    let identifierType = $("#identifierType").val();
    let assetName = $("#assetName").val();
    let purchaseName = $("#purchaseName").val();
    let purchaseDate = $("#purchaseDate").val();
    let purchasePrice = $("#purchasePrice").val();
    let marketValue = $("#marketValue").val();
    let description = $("#assetDescription").val();
  
    let params = {
      id: id,
      client_id: currentDataset.recordId,
      identifier: identifier,
      identifier_type: identifierType,
      name: assetName,
      purchase_name: purchaseName,
      purchase_date: purchaseDate,
      purchase_price: purchasePrice,
      market_value: marketValue,
      description: description,
    };
  
    return params;
  }