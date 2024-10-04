import http from "../services/apiServices";
import generalConfig from "../GeneralConfig.json";


export const fetchOrdersAPI = async (criteria) => {
  const params = Object.keys(criteria).reduce((acc, key) => {
    if (criteria[key].value !== null) {
      acc[key] = criteria[key].value;
      acc[`${key}FilterMatchMode`] = criteria[key].filterMatchMode;
    }
    return acc;
  }, {});

  params.pageNumber = criteria.pageNumber;
  params.pageSize = criteria.pageSize;

  const result = await http.get(`${process.env.REACT_APP_API_ENDPOINT_PREFIX}orders`, {
    params,
  });
  return result;
};



export const fetchOrdersItemsPreperationsAPI = async () => {
  const result = await http.get(`${process.env.REACT_APP_API_ENDPOINT_PREFIX}orders/itemsPreperations`);
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