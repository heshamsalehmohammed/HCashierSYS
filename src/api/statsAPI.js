import http from "../services/apiServices";


export const fetchStatsAPI = async (criteria) => {
  const result = await http.get(`${process.env.REACT_APP_API_ENDPOINT_PREFIX}statistics`, {params:criteria});
  return result;
};
