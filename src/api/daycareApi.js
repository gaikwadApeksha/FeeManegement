import axios from "axios";

// const API_URL = "http://localhost:8080/api/daycare";
const API_URL = `${import.meta.env.VITE_API_URL}/api/daycare`;

export const saveDaycareStudent = (data) => {
  return axios.post(`${API_URL}/save`, data);
};

export const getAllDaycareStudents = () => {
  return axios.get(`${API_URL}/all`);
};

export const getDaycareStudentById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

export const updateDaycareStudent = (id, data) => {
  return axios.put(`${API_URL}/update/${id}`, data);
};

export const deleteDaycareStudent = (id) => {
  return axios.delete(`${API_URL}/delete/${id}`);
};
