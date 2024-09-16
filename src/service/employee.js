import axios from 'axios';

export const fetchData = async (baseUrl, endpoint) => {
  try {
    const response = await axios.get(`${baseUrl}/${endpoint}`);
    return response.data;  
  } catch (error) {
    throw error;  
  }
};



export const createUser = async (baseUrl, endpoint, userData) => {
  try {
    const response = await axios.post(`${baseUrl}/${endpoint}`, userData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.log(userData);
    if (error.response) {
      // Server responded with a status code outside 2xx
      console.error("Response Error: ", error.response.data);
      console.error("Response Status: ", error.response.status);
      console.error("Response Headers: ", error.response.headers);
    } else if (error.request) {
      // No response received from the server
      console.error("Request Error: ", error.request);
    } else {
      // Something else triggered the error
      console.error("Error", error.message);
    }
    console.error("Error Config: ", error.config);
    throw error;
  }
};


export const updateEmployee = async (baseUrl, id, updatedData) => {
  try {
    const response = await axios.patch(`${baseUrl}/employe/update`, updatedData, {
      params: { id }, // Pass ID as a query parameter
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Update successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating employee:', error);
    throw error; 
  }
};



export const deleteEmployees = async (baseUrl, ids) => {
  try {
    const response = await axios.delete(`${baseUrl}/employe/delete`, {
      data: { ids },
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting employees:", error);
    throw error; 
  }
};

//user service

export const updateUser = async (data) => {
  try {
    const response = await axios.patch('http://localhost:3000/user/update', data);
    return response.data; // Return the updated data
  } catch (error) {
    console.error('Update failed:', error);
    throw error;
  }
};
