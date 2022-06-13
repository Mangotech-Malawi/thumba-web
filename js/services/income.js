import { apiClient } from "./api-client.js";

export function add(params){
    return apiClient("/api/v1/income/new", "POST", "json", 
    false, false, params);
  }
  