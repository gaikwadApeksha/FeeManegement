import axios from "axios";

// const API_URL = "http://localhost:8080/api/students";

const API_URL = `${import.meta.env.VITE_API_URL}/api/students`;

export const saveStudent = (student) => {
  return axios.post(`${API_URL}/save`, student);
};

export const getAllStudents = () => {
  return axios.get(`${API_URL}/all`);
};
