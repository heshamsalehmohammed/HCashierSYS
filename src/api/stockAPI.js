import http from "../services/apiServices";
import generalConfig from "../GeneralConfig.json";


export const fetchStockItemsAPI = async (criteria) => {
  const result = await http.get(
    `${process.env.REACT_APP_API_ENDPOINT_PREFIX}stockItems`,
    {params:criteria}
  );
  return result;
};

export const editStockItemAPI = async (customer) => {
  const result = await http.put(
    `${process.env.REACT_APP_API_ENDPOINT_PREFIX}stockItems`,
    customer
  );
  return result;
};

export const addStockItemAPI = async (customer) => {
  const result = await http.post(
    `${process.env.REACT_APP_API_ENDPOINT_PREFIX}stockItems`,
    customer
  );
  return result;
};