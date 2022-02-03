import axiosRateLimit from "axios-rate-limit";
import axios from "axios";


const http = axiosRateLimit(axios.create(), {maxRequests: 4, perMilliseconds: 1000})

export {}

export default http