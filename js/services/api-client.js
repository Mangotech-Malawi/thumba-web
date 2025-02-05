
import * as conn_data from "./config.js";

let config = conn_data.getConfigs();
let token = sessionStorage.getItem("token");

let configs = JSON.parse(localStorage.getItem("configs"));

if ( typeof configs == undefined || configs === null || configs === ''){
    $.when(conn_data.getConfigs()).done(function(loaded_configs){
        localStorage.setItem("configs", JSON.stringify(loaded_configs));
        config = loaded_configs;
    });
}

export function apiClient(path, type, dataType, async, cache, data) {
    let result = null
    $.ajax({
        url: `${config.apiProtocol}://${config.apiURL}:${config.apiPort}${path}`,
        type: type,
        dataType: dataType,
        async: async,
        cache: cache,
        headers: {
            'Authorization': 'Bearer ' + token
        },
        data: data,
        success: function (res) {
            result = res
        },
        error: function(res){
            if(res.status === 401){
               sessionStorage.clear();
               localStorage.clear();
            } 
        } 
    }).fail(function (jqXHR, testStatus, errorThrown) {

    });

    return result;
}


export function fileApiClient(path, type, dataType, async, cache = false, data, isFile = false) {
    let result = null;

    const url = `${config.apiProtocol}://${config.apiURL}:${config.apiPort}${path}`
    const headers =  {
        Authorization: `Bearer ${token}`
    };

    if(!isFile){
        headers["Content-Type"] = "application/json";
    }


    $.ajax({
        url: url,
        type: type,
        dataType: dataType,
        async: async,
        cache: cache,
        headers: headers,
        contentType: isFile ? false : "application/json",
        processData: !isFile,
        data: isFile ? data : data, //JSON.stringify(data) gotta be checked
        success: function (res) {
            result = res
        },
        error: function(res){
            if(res.status === 401){
               sessionStorage.clear();
               localStorage.clear();
            } else {
                console.error("API error:", res);
            } 
        } 
    }).fail(function (jqXHR, testStatus, errorThrown) {

    });

    return result;
}