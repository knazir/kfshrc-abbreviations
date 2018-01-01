class Api {
  static async _send(method, path, body) {
    const opts = {
      method: method,
      credentials: "include",
      headers: {}
    };
    if (body) {
      opts.headers["Content-Type"] = "application/json";
      opts.body = JSON.stringify(body);
    }
    const res = await fetch(`${process.env.REACT_APP_API_URL}${path}`, opts);
    const json = await res.json();
    return json;
  }

  static _get(path) {
    return Api._send("get", path);
  }

  static _post(path, body) {
    return Api._send("post", path, body);
  }

  static list() {
    return Api._get("/abbreviations");
  }

  static forbidden() {
    return Api._get("/forbidden");
  }
}

export default Api;
