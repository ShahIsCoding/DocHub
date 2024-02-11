import { api } from "./api";

// create an instance to check if token is present or not
export const documentAPI = {
  saveDocument: (payload, onSuccess, onError) => {
    api
      .post("/document/save", payload)
      .then((resp) => onSuccess && onSuccess(resp.data))
      .catch((err) => onError && onError(err));
  },
  saveUser: (payload, onSuccess, onError) => {
    api
      .post("/document/saveUser", payload)
      .then((resp) => onSuccess && onSuccess(resp.data))
      .catch((err) => onError && onError(err));
  },
};
