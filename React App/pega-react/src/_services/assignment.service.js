import { axios, getError, ReferenceHelper } from "../_helpers";
import { endpoints } from "./endpoints";

/**
 * Functions used to issue AJAX requests and manage responses.
 * All of the included methods use the Axios library for Promise-based requests.
 */
export const assignmentService = {
  getAssignment,
  getFieldsForAssignment,
  performRefreshOnAssignment,
  performActionOnAssignment,
  saveAssignment,
  assignments,
  navigationSteps
};

function getAssignment(id) {
  return axios
    .get(encodeURI(endpoints.BASEURL + endpoints.ASSIGNMENTS + "/" + id))
    .then(function(response) {
      return response.data;
    })
    .catch(function(error) {
      return Promise.reject(getError(error));
    });
}

function getFieldsForAssignment(assignment, actionId) {
  if (!actionId) {
    if (assignment.actions && assignment.actions.length > 0) {
      actionId = assignment.actions[0].ID;
    } else {
      return Promise.reject("No valid actions found.");
    }
  }

  return axios
    .get(
      encodeURI(
        endpoints.BASEURL +
          endpoints.ASSIGNMENTS +
          "/" +
          assignment.ID +
          endpoints.ACTIONS +
          "/" +
          actionId
      ))
    .then(function(response) {
      return response.data;
    })
    .catch(function(error) {
      return Promise.reject(getError(error));
    });
}

// body has already been passed thru ReferenceHelper.getPostContent
function performRefreshOnAssignment(assignmentID, actionID, body, pageInstr) {
  let refreshFor = "";
  if (body && body.refreshFor) {
    refreshFor = `?refreshFor=${body.refreshFor}`;
    delete body.refreshFor;
  }

  return axios
    .put(
      encodeURI(
        endpoints.BASEURL + endpoints.ASSIGNMENTS + "/" + assignmentID + endpoints.ACTIONS + "/" + actionID + endpoints.REFRESH + refreshFor),
        (pageInstr && pageInstr.pageInstructions ?
          {
            content: body,
            pageInstructions: pageInstr.pageInstructions
          } :
          {
            content: body
          }))
    .then(function(response) {
      return response.data;
    })
    .catch(function(error) {
      return Promise.reject(getError(error));
    });
}

function performActionOnAssignment(assignmentID, actionID, body, pageInstr) {
  return axios
    .post(
      encodeURI(endpoints.BASEURL + endpoints.ASSIGNMENTS + "/" + assignmentID),
      ((pageInstr.postSettings.bUseEmbedPI || pageInstr.postSettings.bUseRepeatPI) ?
        {
          content: ReferenceHelper.getPostContent(body, pageInstr.postSettings),
          pageInstructions: pageInstr.pageInstructions
        } :
        {
          content: ReferenceHelper.getPostContent(body, pageInstr.postSettings)
        }),
      {
        params: {
          actionID: actionID
        }
      }
    )
    .then(function(response) {
      return response.data;
    })
    .catch(function(error) {
      return Promise.reject(error);
    });
}

// More efficient save assignment is available with 8.4 and better
function saveAssignment(assignmentID, actionID, body, pageInstr) {
  return axios
    .post(
      encodeURI(endpoints.BASEURL + endpoints.ASSIGNMENTS + "/" + assignmentID),
      (pageInstr.postSettings.bUseEmbedPI || pageInstr.postSettings.bUseRepeatPI) ?
        {
          content: ReferenceHelper.getPostContent(body, pageInstr.postSettings ),
          pageInstructions: pageInstr.pageInstructions
        } :
        {
          content: ReferenceHelper.getPostContent(body, pageInstr.postSettings)
        },
      {
        params: {
          actionID: actionID,
          saveOnly: "true"
        }
      }
    )
    .then(function(response) {
      return response.data;
    })
    .catch(function(error) {
      return Promise.reject(error);
    });
}

function assignments() {
  return axios
    .get(endpoints.BASEURL + endpoints.ASSIGNMENTS)
    .then(function(response) {
      return response.data.assignments;
    })
    .catch(function(error) {
      return Promise.reject(getError(error));
    });
}

function navigationSteps(assignmentID, step, etag) {
  return axios
    .patch(
      encodeURI(endpoints.BASEV2URL + endpoints.ASSIGNMENTS + "/" + assignmentID + endpoints.NAVIGATION_STEPS + "/" + step),
      { content: {} },
      {
        params: { viewType: "none"},
        headers: {
          "if-match": etag
        }
      }
    )
    .then(function(response) {
      return response.data;
    })
    .catch(function(error) {
      return Promise.reject(getError(error));
    });

}
