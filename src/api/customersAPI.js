import http from "../services/apiServices";
import generalConfig from "../GeneralConfig.json";


export const fetchCustomersAPI = async (criteria) => {
  const result = await http.get(
    `${process.env.REACT_APP_API_ENDPOINT_PREFIX}customers`,
    {params:criteria}
  );
  return result;
};

export const editCustomerAPI = async (customer) => {
  const result = await http.put(
    `${process.env.REACT_APP_API_ENDPOINT_PREFIX}customers`,
    customer
  );
  return result;
};

export const addCustomerAPI = async (customer) => {
  const result = await http.post(
    `${process.env.REACT_APP_API_ENDPOINT_PREFIX}customers`,
    customer
  );
  return result;
};