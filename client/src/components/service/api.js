import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3002",
});

export const userApi = {
  register: (payload, onSuccess, onError) => {
    api
      .post("/user/register", payload)
      .then((resp) => onSuccess && onSuccess(resp.data))
      .catch((err) => onError && onError(err));
  },
};
