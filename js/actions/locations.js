import * as locations from "../services/locations.js";

$(function () {
    $(document).on("change", ".region", function (e) {
        const region_id = $(this).val();
        const elementId = $(this).attr('id');

        if (elementId == "homeRegion")
            loadDistricts(region_id, "homeDistrict");
        else
            loadDistricts(region_id, "currentDistrict")
    });

    $(document).on("change", ".district", function (e) {
        const district_id = $(this).val();
         const elementId = $(this).attr('id');

        if (elementId == "homeDistrict")
           loadTraditionalAuthorities(district_id, "homeTa");
        else
           loadTraditionalAuthorities(district_id, "currentTa");
       
    });

    $(document).on("change", ".ta", function (e) {
        const traditional_authority_id = $(this).val();
         const elementId = $(this).attr('id');
        if (elementId == "homeTa")
           loadVillages(traditional_authority_id, "homeVillage");
        else
           loadVillages(traditional_authority_id, "currentVillage");
       
    });
});

export function loadRegions() {
    $.when(locations.getRegions()).done(function (regions) {
        let regionsArray = []
        regions.forEach(function (region, index) {
            regionsArray.push(
                '<option value ="',
                region.id,
                '">',
                `${region.name}`,
                "</option>"
            );
        });

        $("#homeRegion").html(regionsArray.join("")).trigger("change");
         $("#currentRegion").html(regionsArray.join("")).trigger("change");

    });

}

function loadDistricts(region_id, elementId) {
    $.when(locations.getDistricts({ region_id: region_id })).done(function (districts) {
        let districtsArray = []
        districts.forEach(function (district, index) {
            districtsArray.push(
                '<option value ="',
                district.id,
                '">',
                `${district.name}`,
                "</option>"
            );
        });

        $(`#${elementId}`).html(districtsArray.join("")).trigger("change");
    });
}

function loadTraditionalAuthorities(district_id, elementId) {
    $.when(locations.getTraditionalAuthorities({ district_id: district_id })).done(function (traditional_authorities) {
        let traditionalAuthoritiesArray = []
        traditional_authorities.forEach(function (ta, index) {
            traditionalAuthoritiesArray.push(
                '<option value ="',
                ta.id,
                '">',
                `${ta.name}`,
                "</option>"
            );
        });

        $(`#${elementId}`).html(traditionalAuthoritiesArray.join("")).trigger("change");
    });
}

function loadVillages(traditional_authority_id, elementId) {
    $.when(locations.getVillages({ traditional_authority_id: traditional_authority_id })).done(function (villages) {
        let villagesArray = []
        villages.forEach(function (village, index) {
            villagesArray.push(
                '<option value ="',
                village.id,
                '">',
                `${village.name}`,
                "</option>"
            );
        });

        $(`#${elementId}`).html(villagesArray.join(""));
    });
}

