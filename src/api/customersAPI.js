import http from "../services/apiServices";
import generalConfig from "../GeneralConfig.json";


export const fetchCustomersAPI = async (criteria) => {
  const result = await http.get(
    `${process.env.REACT_APP_API_ENDPOINT_PREFIX}customers`,
    {params:criteria}
  );
  return result;
};

export const fetchCustomerAPI = async (id) => {
  const result = await http.get(
    `${process.env.REACT_APP_API_ENDPOINT_PREFIX}customers/${id}`
  );
  return result;
};


export const editCustomerAPI = async (id,customer) => {
  const result = await http.put(
    `${process.env.REACT_APP_API_ENDPOINT_PREFIX}customers/${id}`,
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

export const deleteCustomerAPI = async (id) => {
  const result = await http.delete(
    `${process.env.REACT_APP_API_ENDPOINT_PREFIX}customers/${id}`
  );
  return result;
};