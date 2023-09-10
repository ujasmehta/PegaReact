import { endpoints } from "./endpoints";
import { axios, getError } from "../_helpers";

/**
 * Functions used to issue AJAX requests and manage responses.
 * All of the included methods use the Axios library for Promise-based requests.
 */
export const dataPageService = {
  getDataPage
};

function getDataPage(id, params) {
  return axios
    .get(endpoints.BASEURL + endpoints.DATA + "/" + id, {
      params: params
    })
    .then(function(response) {
      return response.data;
    })
    .catch(function(error) {
      return Promise.reject(getError(error));
    });
}
