import axios from 'axios';

const VIETNAM_API_URL = 'https://provinces.open-api.vn/api';

const LocationService = {
    // Lấy danh sách tỉnh/thành phố
    getProvinces: async () => {
        try {
            const response = await axios.get(`${VIETNAM_API_URL}/p`);
            console.log('Provinces data:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching provinces:', error);
            throw error;
        }
    },

    // Lấy danh sách quận/huyện theo tỉnh/thành phố
    getDistrictsByProvince: async (provinceCode) => {
        try {
            const response = await axios.get(`${VIETNAM_API_URL}/p/${provinceCode}?depth=2`);
            console.log('Districts data:', response.data.districts);
            return response.data.districts;
        } catch (error) {
            console.error('Error fetching districts:', error);
            throw error;
        }
    },

    // Lấy danh sách phường/xã theo quận/huyện
    getWardsByDistrict: async (districtCode) => {
        try {
            const response = await axios.get(`${VIETNAM_API_URL}/d/${districtCode}?depth=2`);
            console.log('Wards data:', response.data.wards);
            return response.data.wards;
        } catch (error) {
            console.error('Error fetching wards:', error);
            throw error;
        }
    }
};

export default LocationService; 