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
  const response = await fetch(BASE_URL_API + requestModel.url, {
    ...requestModel.option,
    method: "GET",
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  });
  const json = await response.json();
  return json;
};

//POST METHOD
const httpPost = async (requestModel) => {
  const response = await fetch(BASE_URL_API + requestModel.url, {
    ...requestModel.option,
    method: "POST",
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  });
  const json = await response.json();
  return json;
};

export { initializeAPIService, httpGet, httpPost };
