import axios from "axios"
import { ACCESS_TOKEN } from "../../constants/Connect";

const BASE_URL = "http://localhost:8080/"

class RenterService {
    searchRenters(query = '', pageNo = 0, pageSize = 10) {
        const params = new URLSearchParams({
            query: query || '',
            role: 'ROLE_USER',
            pageNo: pageNo,
            pageSize: pageSize
        });

        return axios.get(BASE_URL + `users/search?${params.toString()}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`
                }
            }
        );
    }

    getRenterById(id) {
        return axios.get(BASE_URL + `users/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`
                }
            }
        );
    }
}

export default new RenterService();