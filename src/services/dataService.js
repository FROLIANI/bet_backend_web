// src/services/dataService.js
import http from "./httpcommon";

class DataService {
  // USERS ENDPOINTS
  login = (data) => {
    return http.post("/superadmin/login", data);
  };

  getAllBets = (data) => {
    return http.get("/bets/allbets", data);
  };

   getAllPlacedBets = (data) => {
    return http.get("/bets/all-placed-bets", data);
  };

   getAllUsers = (data) => {
    return http.get("/superadmin/users", data);
  };

  updateUser = (id, data) => {
    return http.put(`/api/users/${id}`, data);
  };

  deleteUser = (id) => {
    return http.delete(`/api/users/${id}`);
  };

  // POSTS ENDPOINTS
  writeNewPost = (data) => {
    return http.post("/api/posts", data);
  };

  editPost = (id, data) => {
    return http.put(`/api/posts/${id}`, data);
  };

  likePost = (data) => {
    return http.post("/api/likes", data);
  };

  // CATEGORIES ENDPOINTS
  addNewCategory = (data) => {
    return http.post("/api/categories", data);
  };

  modifyCategory = (id, data) => {
    return http.put(`/api/categories/${id}`, data);
  };
}

export default new DataService();
