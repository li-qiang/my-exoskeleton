import axios from "axios";


const service = axios.create({
  baseURL: 'https://itsc-jira.mercedes-benz.com.cn/jira/rest/',
  timeout: 5000
});

service.interceptors.response.use(
  (res) => res,
  (err) => {
    console.log("error", err);
  }
);

export default service;
