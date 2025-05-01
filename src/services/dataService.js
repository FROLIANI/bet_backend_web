import http from "./httpcommon";

class DataService {
  //SPLASH ENDPOINT
  getSplash = (params) => {
    return http.get("mgt/splash/getSplash.php", { params });
  };

  //USERS ENDPOINTS
  login = (credentials) => {
    return http.post("mgt/users/login.php", credentials);
  };

  createUser = (data) => {
    return http.post("mgt/users/createUser.php", data);
  };

  updateUser = (id, data) => {
    return http.put(`mgt/users/modifyUser.php?id=${id}`, data);
  };

  deleteUser = (id) => {
    return http.delete(`mgt/users/deleteUser.php`, {
      data: { id },
    });
  };

  // POSTS ENDPOINTS
  writeNewPost = (data) => {
    return http.post("mgt/posts/newPost.php", data);
  };

  editPost = (id, data) => {
    return http.put(`mgt/posts/updatePost.php?id=${id}`, data);
  };

  likePost = (data) => {
    return http.post("portal/likes/addLike.php", data);
  }

  //CATEGORIES ENDPOINTS
  addNewCategory = (data) => {
    return http.post("mgt/categories/createCategory.php", data);
  }
  
  modifyCategory = (id, data) => {
    return http.put(`mgt/categories/editCategory.php?id=${id}`, data);
  }

}

export default new DataService();
