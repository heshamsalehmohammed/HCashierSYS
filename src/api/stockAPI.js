import http from "../services/apiServices";
import generalConfig from "../GeneralConfig.json";


export const fetchStockItemsAPI = async (criteria) => {
  const result = await http.get(
    `${process.env.REACT_APP_API_ENDPOINT_PREFIX}stockItems`,
    {params:criteria}
  );
  return result;
};

export const fetchStockItemAPI = async (id) => {
  const result = await http.get(
    `${process.env.REACT_APP_API_ENDPOINT_PREFIX}stockItems/${id}`
  );
  return result;
};

export const editStockItemAPI = async (id,stockItem) => {
  const result = await http.put(
    `${process.env.REACT_APP_API_ENDPOINT_PREFIX}stockItems/${id}`,
    stockItem
  );
  return result;
};

export const addStockItemAPI = async (stockItem) => {
  const result = await http.post(
    `${process.env.REACT_APP_API_ENDPOINT_PREFIX}stockItems`,
    stockItem
  );
  return result;
};


export const deleteStockItemAPI = async (id) => {
  const result = await http.delete(
    `${process.env.REACT_APP_API_ENDPOINT_PREFIX}stockItems/${id}`
  );
  return result;
};