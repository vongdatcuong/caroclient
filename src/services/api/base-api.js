const BASE_URL_API = "http://localhost:4000/api";
let token = "";

/** REQUEST MODEL
 *  url: string
 *  option (Optional): Object
 */

//INITIALIZE
const initializeAPIService = () => {
  token = JSON.parse(localStorage.getItem("token"));
};

//GET METHOD
const httpGet = async (requestModel) => {
  try {
    const response = await fetch(BASE_URL_API + requestModel.url, {
      method: "GET",
      ...requestModel.option,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const json = await response.json();
    return json;
  } catch (e) {
    throw e;
  }
};

//POST METHOD
const httpPost = async (requestModel) => {
  try {
    const response = await fetch(BASE_URL_API + requestModel.url, {
      ...requestModel.option,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const json = await response.json();
    return json;
  } catch (e) {
    throw e;
  }
};

export { initializeAPIService, httpGet, httpPost };
