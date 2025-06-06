import axios from "axios"
import { ACCESS_TOKEN } from "../../constants/Connect";

const BASE_URL = "http://localhost:8080/"

class RentService {
  saveRentData(rentData) {
    return axios.post(BASE_URL + 'api/rent', rentData,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

export default new RentService(); 