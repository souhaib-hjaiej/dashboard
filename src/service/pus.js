import axios from 'axios';


export const ajouterpus = async (url, data) => {
    try {
      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error in ajouterpus:", error);
      throw error;
    }
  };


  export const fetchPusData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/pus/all');
      return response.data; 
    } catch (error) {
      console.error('Error fetching PUS data:', error);
      throw error;
    }
  };

  export const updatePus = async (id, updatedSim) => {
    try {
      
      const response = await axios.patch('http://localhost:3000/pus/update', {
       ...updatedSim
      });
      return response.data;
  
    } catch (error) {
      console.error('Error updating PUS:', error);
      throw error; 
    }
  };


  
export const deletepus = async (ids) => {
  try {
    const response = await axios.delete('http://localhost:3000/pus/delete',
      {
      data: { ids },
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting pus:", error);
    throw error; 
  }
};
