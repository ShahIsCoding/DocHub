import { api } from "./api";

export const userAPI = {
  register: (payload, onSuccess, onError) => {
    api
      .post("/user/register", payload)
      .then((resp) => onSuccess && onSuccess(resp.data))
      .catch((err) => onError && onError(err));
  },
};
