const baseUrl = "http://api.dev.letstudy.org";

const httpGet = (request) => {
  return new Promise(async (resolve, reject) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const response = await fetch(baseUrl + request.url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "content-type": "application/json",
        authorization: "Bearer " + user.token,
      },
      body: JSON.stringify(request.body),
    });
    const json = await response.json();
    if (response.status === 200) {
      resolve(json);
    } else {
      reject(json.message);
    }
  });
};
const httpPost = (request) => {
  return new Promise(async (resolve, reject) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const response = await fetch(baseUrl + request.url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "content-type": "application/json",
        authentication: "Bearer " + user.token,
      },
      body: JSON.stringify(request.body),
    });
    const json = await response.json();
    if (response.status === 200) {
      resolve(json);
    } else {
      reject(json.message);
    }
  });
};

export { httpGet, httpPost };
