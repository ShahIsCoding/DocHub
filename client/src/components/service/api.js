import axios from "axios";
import { apiConstants, apiToken } from "../constants/apiConstants";
import { Navigate } from "react-router-dom";

export const api = axios.create({
  baseURL: "http://localhost:3002",
});

api.interceptors.request.use((config) => {
  const token = apiConstants.TOKEN;
  config.headers.Authorization = token;
  return config;
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem("user-token");
      apiConstants.navigator("/login");
      alert("login timeout");
    }
  }
);
export const userApi = {
  register: (payload, onSuccess, onError) => {
    api
      .post("/user/register", payload)
      .then((resp) => onSuccess && onSuccess(resp.data))
      .catch((err) => onError && onError(err));
  },
  login: (payload, onSuccess, onError) => {
    api
      .post("/user/login", payload)
      .then((resp) => onSuccess && onSuccess(resp.data))
      .catch((err) => onError && onError(err));
  },
  getDocuments: (onSuccess, onError) => {
    api
      .get("/user/getDocuments")
      .then((resp) => onSuccess && onSuccess(resp.data))
      .catch((err) => onError && onError(err));
  },
};

export const documentApi = {
  getDocument: (onSuccess, onError) => {
    api
      .get("/document/getDocument")
      .then((resp) => onSuccess && onSuccess(resp.data))
      .catch((err) => onError && onError(err));
  },
  createDocument: (payload, onSuccess, onError) => {
    api
      .post("/document/createDocument", payload)
      .then((resp) => onSuccess && onSuccess(resp.data))
      .catch((err) => onError && onError(err));
  },
  saveDocument: (payload, onSuccess, onError) => {
    api
      .post("/document/saveDocument", payload)
      .then((resp) => onSuccess && onSuccess(resp.data))
      .catch((err) => onError && onError(err));
  },
  removeDocuemnt: (payload, onSuccess, onError) => {
    api
      .delete(`/document/removeDocument/${payload}`)
      .then((resp) => onSuccess && onSuccess(resp))
      .catch((err) => onError && onError(err));
  },
};
