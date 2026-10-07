import api from "./client";

export const swapApi = {
  create: ({ source, target }) => {
    const form = new FormData();
    form.append("source", source);
    form.append("target", target);
    form.append("consent", "true");
    return api.post("/swaps", form).then((res) => res.data);
  },
  list: (page = 1, limit = 12) => api.get("/swaps", { params: { page, limit } }).then((res) => res.data),
  get: (id) => api.get(`/swaps/${id}`).then((res) => res.data),
  remove: (id) => api.delete(`/swaps/${id}`).then((res) => res.data),
  retry: (id) => api.post(`/swaps/${id}/retry`).then((res) => res.data),
};
