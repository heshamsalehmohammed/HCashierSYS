import http from "../services/apiServices";
import generalConfig from "../GeneralConfig.json";


export const fetchCustomersAPI = async (criteria) => {
  const result = await http.get(
    `${generalConfig.API_ENDPOINT_PREFIX}customers`,
    {params:criteria}
  );
  return result;
};

export const editCustomerAPI = async (customer) => {
  const result = await http.put(
    `${generalConfig.API_ENDPOINT_PREFIX}customers`,
    customer
  );
  return result;
};

export const addCustomerAPI = async (customer) => {
  const result = await http.post(
    `${generalConfig.API_ENDPOINT_PREFIX}customers`,
    customer
  );
  return result;
};