import { apiClient } from "./api-client.js";

export function register(params) {
    return apiClient("/api/v1/account/new", "POST", "json", false, false, params);
}
  