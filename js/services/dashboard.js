import { apiClient } from "./api-client.js";


export function admin(){
    let dashboardData = fetchClientsData();
    populateSharesChart(dashboardData.investors);
    $("#totalClients").text(dashboardData.client_count);
    $("#totalUsers").text(dashboardData.user_count);
}

function populateSharesChart(investors){

}

function fetchClientsData() {
    let data = apiClient("/api/v1/dashboard", "GET", "json", false, false, {});
    if (data != null) {
        return  data;
    }
}
  