import http from "../services/apiServices";
import generalConfig from "../GeneralConfig.json";


export const fetchOrdersAPI = async (criteria) => {
  const result = await http.get(
    `${process.env.REACT_APP_API_ENDPOINT_PREFIX}orders`,
    {params:criteria}
  );
  return result;
};

export const fetchOrderAPI = async (id) => {
  const result = await http.get(
    `${process.env.REACT_APP_API_ENDPOINT_PREFIX}orders/${id}`
  );
  return result;
};


export const editOrderAPI = async (id,customer) => {
  const result = await http.put(
    `${process.env.REACT_APP_API_ENDPOINT_PREFIX}orders/${id}`,
    customer
  );
  return result;
};

export const addOrderAPI = async (customer) => {
  const result = await http.post(
    `${process.env.REACT_APP_API_ENDPOINT_PREFIX}orders`,
    customer
  );
  return result;
};

export const deleteOrderAPI = async (id) => {
  const result = await http.delete(
    `${process.env.REACT_APP_API_ENDPOINT_PREFIX}orders/${id}`
  );
  return result;
};