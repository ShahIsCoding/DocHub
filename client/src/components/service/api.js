import axios from "axios";
import { constants } from "../constants/apiConstants";

export const api = axios.create({
  baseURL: "http://localhost:3002",
});

api.interceptors.request.use((config) => {
  const token = constants.TOKEN;
  config.headers.Authorization = token;
  return config;
});
api.interceptors.response.use(
  (response) => {
    console.log(response.data.message);
    response.data.message !== undefined &&
      constants.notify({
        message: response?.data?.message,
        statusCode: response.status,
      });
    return response;
  },
  (error) => {
    constants.notify({
      message: error?.response?.data?.message,
      statusCode: error.response.status,
    });
    if (error.response.status === 401) {
      localStorage.removeItem("user-token");
      constants.navigator("/login");
    }
  }
);
export const userApi = {
  register: (payload, onSuccess) => {
    api
      .post("/user/register", payload)
      .then((resp) => onSuccess && onSuccess(resp.data));
  },
  login: (payload, onSuccess) => {
    api
      .post("/user/login", payload)
      .then((resp) => onSuccess && onSuccess(resp.data));
  },
  refreshLogin: (onSuccess) => {
    api
      .get("/user/refreshLogin")
      .then((resp) => onSuccess && onSuccess(resp.data));
  },
  getDocuments: (onSuccess) => {
    api
      .get("/user/getDocuments")
      .then((resp) => onSuccess && onSuccess(resp.data));
  },
};

export const documentApi = {
  getDocument: (payload, onSuccess) => {
    api
      .get(`/document/getDocument:${payload}`)
      .then((resp) => onSuccess && onSuccess(resp.data));
  },
  createDocument: (payload, onSuccess) => {
    api
      .post("/document/createDocument", payload)
      .then((resp) => onSuccess && onSuccess(resp.data));
  },
  saveDocument: (payload, onSuccess) => {
    api
      .post("/document/saveDocument", payload)
      .then((resp) => onSuccess && onSuccess(resp.data));
  },
  removeDocuemnt: (payload, onSuccess) => {
    api
      .delete(`/document/removeDocument/${payload}`)
      .then((resp) => onSuccess && onSuccess(resp));
  },
};
