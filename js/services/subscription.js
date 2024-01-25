import { apiClient } from "./api-client.js";

export function fetchSubscriptions(params) {
    let data = apiClient("/api/v1/subscriptions", "GET", "json",
        false, false, {});

    populateSubscriptionsTable(data);
}

export function Subscribe(params){
    return apiClient("/api/v1/subscribe", "POST", "json", false, false, params);
}

function populateSubscriptionsTable(dataSet) {
    $("#subscriptionsTable").DataTable({
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
            { data: "email" },
            { data: "created_at" },
            { data: null }
        ],
        columnDefs: [
            {
                render: getDelBtn,
                data: null,
                targets: [3],
            },
        ],
    });
}