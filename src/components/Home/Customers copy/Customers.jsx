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
import CreateCustomerPopup from "./CreateCustomerPopup";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import _ from "lodash";

const Customers = () => {
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
      <CreateCustomerPopup />
      <div className="surface-ground px-4 pb-8 pt-4 md:px-6 lg:px-8 flex align-items-center justify-content-center flex-column">
        <Button
          type="button"
          label="Add New Customer"
          icon="pi pi-customers"
          outlined
          badgeClassName="p-badge-danger"
          className="mb-4"
          onClick={() => {
            dispatch(openAddCustomerPopupAddress());
          }}
        />

        <div className="m-1">Or search for existing customer</div>
        <IconField iconPosition="left" className="mt-0 m-3">
          <InputIcon className="pi pi-search"> </InputIcon>
          <InputText
            placeholder="Search by number or name"
            onChange={(e) => {
              dispatch(setSearchTerm(e.target.value));
              debouncedFetch()
            }}
            value={serachTermValue}
          />
        </IconField>
      </div>
      <DataTable
        value={customers}
        stripedRows
        className="w-12 md:w-8 m-auto -mt-5 shadow-7"
        style={tableStyles}
      >
        <Column
          field="phone"
          header="Phone"
          headerStyle={headerStyles}
          headerClassName="text-center "
        ></Column>
        <Column
          field="name"
          header="Name"
          headerStyle={headerStyles}
          headerClassName="text-center "
        ></Column>
        <Column
          field="actions"
          header="Actions"
          headerStyle={headerStyles}
          headerClassName="text-center "
        ></Column>
      </DataTable>
    </div>
  );
};

export default Customers;
