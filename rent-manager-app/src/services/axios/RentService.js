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

  updatePaymentStatus(id, paid) {
    return axios.put(
      BASE_URL + `api/rent/${id}/status?paid=${paid}`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`
        }
      }
    );
  }

  getAllRent(pageNo, pageSize) {
    return axios.get(BASE_URL + `api/rent?pageNo=${pageNo}&pageSize=${pageSize}`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`
        }
      }
    );
  }
}

export default new RentService(); 