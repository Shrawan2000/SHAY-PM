import { axiosInstance } from "./axiosInstance";

//add a notification

export const AddNotification = async (data) => {
  try {
    const response = await axiosInstance.post("/api/notifications/notify", data);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// get all notification 
export const GetAllNotifications = async () => {
    try {
      const response = await axiosInstance.get("/api/notifications/get-all-notifications");
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  };
  

  // delete  notification 
export const DeleteNotification = async (id) => {
    try {
      const response = await axiosInstance.delete(`/api/notifications/delete-notification/${id}`);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  };
  
    // read all  notification by users
export const ReadAllNotifications = async (id) => {
    try {
      const response = await axiosInstance.put("/api/notifications/read-all-notifications" );
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  };
  