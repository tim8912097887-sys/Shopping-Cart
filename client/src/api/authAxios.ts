import axios from "axios";

export const authAxios = axios.create({
    baseURL: "http://localhost:3000/auth",
    timeout: 10000,
    // Server response with json
    responseType: "json",
    // Prevent url overide baseURL
    allowAbsoluteUrls: false
})