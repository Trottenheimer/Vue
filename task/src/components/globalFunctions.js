import axios from "axios";
import jwtDecode from 'jwt-decode';


export function getCookie (name){
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name))
            return cookie.substring(name.length + 1);
    }
    return null;
}
export async function getData(url, query){
    let config = {
        headers:{
            Authorization: "Bearer " + getCookie('token')
        }
    }
    try {
        const response = await axios.get(url + query, config);
        return response.data;
    } catch (error) {
        console.error('ошибка при сборе данных: ', error);
        return error;
    }
}
export async function postData(url, query, data){
    let config = {
        headers:{
            //Prefer: "resolution=merge-duplicates",
            Authorization: "Bearer " + getCookie('token')
        }
    }
    try {
        console.log('отправляемый json', data);
        console.log('адрес', url+query);
        let response = {}
        getCookie('token') === null
            ? response = await axios.post(url + query, data)
            : response = await axios.post(url + query, data, config);
        return response;
    } catch (error) {
        console.error('ошибка при POST-запросе: ', error);
        return error.response;
    }
}
export async function updateData(url, query, data){
    let config = {
        headers:{
            Authorization: "Bearer " + getCookie('token')
        }
    }
    try {
        console.log('отправляемый json', data);
        console.log('адрес', url+query);
        const response = await axios.patch(url + query, data, config);
        return response;   
    } catch (error) {
        console.log('ошибка при обновлении: ', error);
        return error;
    }
}
export async function deleteData(url, query){
    let config = {
        headers:{
            Authorization: "Bearer " + getCookie('token')
        }
    }
    try {
        const response = await axios.delete(url + query, config);
        return response;    
    } catch (error) {
        console.error('ошибка при удалении: ', error);
        return error;
    }
}
export function decodeToken(token){
    token = token || getCookie('token')
    if (!token){
        console.error('Токен отсутствует');
        return null
    }
    try {
        const decoded = jwtDecode(token/*, { secret: secretKey }*/);
        return decoded;
    } catch (error) {
        console.error('Ошибка при декодировании токена: ', error);
        return null;
    }
}