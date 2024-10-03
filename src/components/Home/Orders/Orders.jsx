import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "primereact/button";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import {
  fetchCustomers,
  openAddCustomerPopupAddress,
  selectCustomers,
  selectCustomersSearchTerm,
  setSearchTerm,
} from "../../../redux/slices/customersSlice";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import _ from "lodash";

const Orders = () => {
  const dispatch = useDispatch();

  const customers = useSelector(selectCustomers);

  const serachTermValue = useSelector(selectCustomersSearchTerm)

  const tableStyles = {
    backgroundColor: "#333", // Dark background
    color: "#fff", // White text
  };

  const headerStyles = {
    backgroundColor: "#444", // Darker header background
    color: "#fff",
  };

  const debouncedFetch = useCallback(
    _.debounce(() => {
      dispatch(fetchCustomers());
    }, 300),
    [dispatch]
  );

  return (
    <div className="">
      <div className="surface-ground px-4 pb-8 pt-4 md:px-6 lg:px-8 flex align-items-center justify-content-center flex-column">

      
      </div>
      
    </div>
  );
};

export default Orders;
