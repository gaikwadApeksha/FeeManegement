import axios from "axios";

// const API_URL = "http://localhost:8080/payments";
const API_URL = `${import.meta.env.VITE_API_URL}/payments`;

export const savePayment = (payment) => {
  return axios.post(API_URL, payment);
};

export const getAllPayments = () => {
  return axios.get(API_URL);
};

export const getPaymentById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

export const deletePayment = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

export const updatePayment = (id, payment) => {
  return axios.put(`${API_URL}/${id}`, payment);
};
