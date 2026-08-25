import axios from "axios";


const API_URL = "http://localhost:8080/api/students";

export const saveStudent = (student) => {
    return axios.post(`${API_URL}/save`, student);
};

export const getAllStudents = () => {
    return axios.get(`${API_URL}/all`);
};