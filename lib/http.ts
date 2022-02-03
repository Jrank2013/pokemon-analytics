import axiosRateLimit from "axios-rate-limit";
import axios from "axios";


const http = axiosRateLimit(axios.create(), {maxRequests: 10, perMilliseconds: 1000})


export default http