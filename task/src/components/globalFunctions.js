import axios from "axios";

export async function getData(url, query){
    try {
        const response = await axios.get(url + query);
        return response.data;
    } catch (error) {
        console.log('ошибка при сборе данных: ', error);
    }
}
export async function postData(url, query, data){
    try {
        console.log('отправляемый json', data);
        console.log('адрес', url+query);
        const response = await axios.post(url + query, data, {headers: {Prefer: "resolution=merge-duplicates"}});
        return response;    
    } catch (error) {
        console.log('ошибка при создании: ', error);
        return error
    }
}
export async function updateData(url, query, data){
    try {
        console.log('отправляемый json', data);
        console.log('адрес', url+query);
        const response = await axios.patch(url + query, data);
        return response;   
    } catch (error) {
        console.log('ошибка при обновлении: ', error);
    }
}
export async function deleteData(url, query){
    try {
        const response = await axios.delete(url + query);
        return response;    
    } catch (error) {
        console.log('ошибка при удалении: ', error);
    }
    
}