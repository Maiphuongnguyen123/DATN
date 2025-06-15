import axios from "axios"
import { ACCESS_TOKEN } from "../../constants/Connect";

const BASE_URL = "http://localhost:8080/"

class RoomService {
  getAllRooms(pageNo = 0, pageSize = 10, title = '') {
    const params = new URLSearchParams({
      pageNo: pageNo,
      pageSize: pageSize,
      title: title || ''
    });
    return axios.get(BASE_URL + `room?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`
        }
      }
    );
  }

  getRoomDetailById(id) {
    return axios.get(BASE_URL + `room/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`
        }
      }
    );
  }

  addNewRoom(formData) {
    return axios.post(BASE_URL + 'room', formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`
        }
      }
    );
  }

  updateRoom(id,formData) {
    return axios.put(BASE_URL + 'room/'+id, formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`
        }
      }
    );
  }

  getAllRoomsNoLimit() {
    return axios.get(BASE_URL + 'room/all-no-limit',
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`
        }
      }
    );
  }
}

export default new RoomService();