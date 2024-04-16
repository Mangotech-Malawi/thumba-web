import { apiClient } from "./api-client.js";

export function add(params) {
    return apiClient("/api/v1/account/new", "POST", "json", false, false, params);
}
  