import axios from "axios";
console.log("API =", process.env.REACT_APP_API);   // thêm dòng này
export const api = axios.create({
  baseURL: process.env.REACT_APP_API || "http://localhost:3001",
});
