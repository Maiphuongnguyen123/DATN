import { API_BASE_URL, ACCESS_TOKEN } from '../../constants/Connect';

const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    })
    
    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
    .then(response => 
        response.json().then(json => {
            if(!response.ok) {
                return Promise.reject(json);
            }
            return json;
        })
    );
};

export function getAllElectricAndWaterOflandlord(pageNo, pageSize, name) {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/electric-water?pageNo="+pageNo+"&pageSize="+pageSize+"&keyword="+name,
        method: 'GET'
    });
}

export function getAllWater(pageNo, pageSize, name) {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/water?pageNo="+pageNo+"&pageSize="+pageSize+"&keyword="+name,
        method: 'GET'
    });
}

export function getCurrentUser() {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/user/me",
        method: 'GET'
    });
}

export function getCurrentlandlord() {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/landlord/me",
        method: 'GET'
    });
}

export function getCurrentAdmin() {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/admin/me",
        method: 'GET'
    });
}

export function forgotPassword(emailRequest) {
    return request({
        url: API_BASE_URL + "/auth/forgot-password",
        method: 'POST',
        body: JSON.stringify(emailRequest)
    });
}

export function changeConfirmedStatus(emailRequest) {
    return request({
        url: API_BASE_URL + "/auth/confirmed",
        method: 'POST',
        body: JSON.stringify(emailRequest)
    });
}

export function resetPassword(resetPassword) {
    return request({
        url: API_BASE_URL + "/auth/reset-password",
        method: 'POST',
        body: JSON.stringify(resetPassword)
    });
}

export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/auth/login",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function signup(signupRequest) {
    return request({
        url: API_BASE_URL + "/auth/signup",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function changePassword(changePasswordRequest) {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/auth/change-password",
        method: 'POST',
        body: JSON.stringify(changePasswordRequest)
    });
}

export function getAllRoomOfCustomer(pageNo, pageSize, title, minPrice, maxPrice, minArea, maxArea, categoryId, provinceCode, districtCode, wardCode) {
    const params = new URLSearchParams();
    params.append('pageNo', pageNo);
    params.append('pageSize', pageSize);
    params.append('title', title || '');
    if (minPrice !== null) params.append('minPrice', minPrice);
    if (maxPrice !== null) params.append('maxPrice', maxPrice);
    if (minArea !== null) params.append('minArea', minArea);
    if (maxArea !== null) params.append('maxArea', maxArea);
    params.append('categoryId', categoryId || 0);
    if (provinceCode) params.append('provinceCode', provinceCode);
    if (districtCode) params.append('districtCode', districtCode);
    if (wardCode) params.append('wardCode', wardCode);

    return request({
        url: API_BASE_URL + "/customer/room?" + params.toString(),
        method: 'GET'
    });
}

export function getAllAccountlandlordForCustomer(pageNo, pageSize) {
    return request({
        url: API_BASE_URL + "/account/customer?pageNo="+pageNo+"&pageSize="+pageSize,
        method: 'GET'
    });
}

export function getAllrRoomByUserId(pageNo, pageSize, userId) {
    return request({
        url: API_BASE_URL + "/room/"+userId+"/landlord"+"?pageNo="+pageNo+"&pageSize="+pageSize,
        method: 'GET'
    });
}

export function followAgents(followRequest) {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/follow",
        method: 'POST',
        body: JSON.stringify(followRequest)
    });
}

export function saveBlog(storeRequest) {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/blog-store/save",
        method: 'POST',
        body: JSON.stringify(storeRequest)
    });
}


export function getUserOfChat() {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/user/message",
        method: 'GET'
    });
}


// ADMIN
export function getAllRoomOfAdmin(pageNo, pageSize, name) {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/room/all?pageNo="+pageNo+"&pageSize="+pageSize+"&title="+name,
        method: 'GET'
    });
}

export function getAllRoomApprovingOfAdmin(pageNo, pageSize, approve) {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/room/all?pageNo="+pageNo+"&pageSize="+pageSize+"&approve="+approve,
        method: 'GET'
    });
}

export function getAllAccpuntOfAdmin(pageNo, pageSize, name) {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/account?pageNo="+pageNo+"&pageSize="+pageSize+"&keyword="+name,
        method: 'GET'
    });
}

export function getAccountById(id) {


    return request({
        url: API_BASE_URL + "/account/" + id,
        method: 'GET'
    });
}

export function approveRoomOfAdmin(id) {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL +"/room/"+ id + "/approve",
        method: 'POST'
    });
}

export function removeRoomOfAdmin(id) {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL +"/room/"+ id ,
        method: 'DELETE'
    });
}

export function lockedAccount(id) {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL +"/auth/"+ id + "/locked",
        method: 'POST'
    });
}

export function sendEmailForlandlord(id, sendEmailRequest) {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL +"/account/send-email/"+ id ,
        method: 'POST',
        body: JSON.stringify(sendEmailRequest)
    });
}

export function sendEmailForContact(sendEmailRequest) {

    return request({
        url: API_BASE_URL +"/account/send-mail-landlord" ,
        method: 'POST',
        body: JSON.stringify(sendEmailRequest)
    });
}

export function setAuthorization(id, roleRequest) {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL +"/account/"+ id +"/authorization" ,
        method: 'POST',
        body: JSON.stringify(roleRequest)
    });
}

export function getAllRequireOfCustomer(pageNo, pageSize, name, phone) {

    return request({
        url: API_BASE_URL + "/request/customer?pageNo="+pageNo+"&pageSize="+pageSize+"&keyword="+name+"&phone="+phone,
        method: 'GET'
    });
}



// landlord
export function getAllRoomOflandlord(pageNo, pageSize, name) {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/room?pageNo="+pageNo+"&pageSize="+pageSize+"&title="+name,
        method: 'GET'
    });
}

export function getAllContractOflandlord(pageNo, pageSize, name) {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/contract?pageNo="+pageNo+"&pageSize="+pageSize+"&name="+name,
        method: 'GET'
    });
}

export function getAllRoomHired(pageNo, pageSize, phone) {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/contract/customer?pageNo="+pageNo+"&pageSize="+pageSize+"&phone="+phone,
        method: 'GET'
    });
}

export function getAllFollow(pageNo, pageSize) {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/follow?pageNo="+pageNo+"&pageSize="+pageSize,
        method: 'GET'
    });
}

export function getAllBlogStore(pageNo, pageSize) {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/blog-store/all?pageNo="+pageNo+"&pageSize="+pageSize,
        method: 'GET'
    });
}

export function getAllMaintenceOflandlord(pageNo, pageSize, name) {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/maintenance?pageNo="+pageNo+"&pageSize="+pageSize+"&keyword="+name,
        method: 'GET'
    });
}

export function getAllRequireOflandlord(pageNo, pageSize, name) {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/request?pageNo="+pageNo+"&pageSize="+pageSize+"&keyword="+name,
        method: 'GET'
    });
}

export function getRoom(id) {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/room/"+id,
        method: 'GET'
    });
}

export function getRentOfHome() {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/room/rent-home",
        method: 'GET'
    });
}

export function getNumber() {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/statistical" ,
        method: 'GET'
    });
}

export function getNumberOfAdmin() {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/statistical/admin" ,
        method: 'GET'
    });
}

export function getByMonth() {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/statistical/get-by-month" ,
        method: 'GET'
    });
}

export function getByCost() {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/statistical/cost" ,
        method: 'GET'
    });
}


export function getContract(id) {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/contract/" + id,
        method: 'GET'
    });
}

export function getElectricAndWater(id) {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/electric-water/" + id,
        method: 'GET'
    });
}

export function checkoutRoom(id) {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL +"/room/"+ id + "/checkout",
        method: 'POST'
    });
}

export function sendRequestForlandlord(data) {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/request",
        method: 'POST',
        body: JSON.stringify(data)
    });
}

export function getRequestById(id) {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/request/" + id,
        method: 'GET'
    });
}

export function changeStatusOfRequest(id) {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/request/" + id,
        method: 'POST'
    });
}

export function getMaintenance(id) {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/maintenance/" + id,
        method: 'GET'
    });
}

export function exportBillRequest(nameBill, description, price, nameRoom, nameOfRent) {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/export-bill" +"?nameBill=" +nameBill+"&description="+description+"&price="+price+"&nameRoom="+nameRoom+"&nameOfRent="+nameOfRent,
        method: 'GET'
    });
}


export function disableRoom(id) {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/room/"+id,
        method: 'POST'
    });
}

export function deleteMaintenance(id) {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/maintenance/"+id,
        method: 'DELETE'
    });
}

export function editRoom(id, formData) {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + '/room/' + id,
        method: 'PUT',
        body: JSON.stringify(formData)
    });
}