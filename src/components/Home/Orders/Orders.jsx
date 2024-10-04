import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "primereact/button";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import _ from "lodash";
import {
  fetchOrders,
  selectOrders,
  selectOrdersSearchTerm,
  setOrdersSearchTerm,
} from "../../../redux/slices/ordersSlice";
import { Tag } from "primereact/tag";
import { formatDate } from "../../../services/utilities";

const Orders = () => {
  const dispatch = useDispatch();

  const orders = useSelector(selectOrders);

  const serachTermValue = useSelector(selectOrdersSearchTerm);

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
      dispatch(fetchOrders());
    }, 300),
    [dispatch]
  );

  useEffect(() => {
    dispatch(fetchOrders());
  }, []);

  const actionsTemplate = (rowData) => {
    return (
      <div className="flex justify-content-start">
        <>
          <Button
            icon="pi pi-pencil"
            className="p-button-rounded p-button-success mr-2"
            onClick={() => handleEdit(rowData)}
            tooltip="Edit"
          />
        </>
      </div>
    );
  };

  const handleEdit = (item) => {};

  return (
    <div className="">
      <div className="surface-ground px-4 pb-8 pt-4 md:px-6 lg:px-8 flex align-items-center justify-content-center flex-column">
        {/* <div className="flex align-items-center justify-content-between w-full  flex-column md:flex-row">
          <IconField iconPosition="left" className="mb-1">
            <InputIcon className="pi pi-search"> </InputIcon>
            <InputText
              placeholder="Search by customer name"
              onChange={(e) => {
                dispatch(setOrdersSearchTerm(e.target.value));
                debouncedFetch();
              }}
              value={serachTermValue}
            />
          </IconField>
        </div> */}
        <DataTable
          value={orders}
          stripedRows
          className="w-12 m-auto shadow-7"
          style={tableStyles}
        >
          <Column
            field="customername"
            header="Customer Name"
            headerStyle={headerStyles}
            headerClassName="text-center "
            body={(rowData) => {
              return (
                <div className="flex justify-content-start">
                  {rowData.customer.name}
                </div>
              );
            }}
          ></Column>

          <Column
            field="customerphone"
            header="Customer Phone"
            headerStyle={headerStyles}
            headerClassName="text-center "
            body={(rowData) => {
              return (
                <div className="flex justify-content-start">
                  {rowData.customer.phone}
                </div>
              );
            }}
          ></Column>

          <Column
            field="totalprice"
            header="Total Price"
            headerStyle={headerStyles}
            headerClassName="text-center "
            body={(rowData) => {
              return (
                <div className="flex justify-content-start">
                  {rowData.totalPrice} EGP
                </div>
              );
            }}
          ></Column>

          <Column
            field="date"
            header="Order Date"
            headerStyle={headerStyles}
            headerClassName="text-center "
            body={(rowData) => {
              return (
                <div className="flex justify-content-start">
                  {formatDate(rowData.date)}
                </div>
              );
            }}
          ></Column>
          <Column
            field="status"
            header="Status"
            headerStyle={headerStyles}
            headerClassName="text-center "
            body={(rowData) => {
              return (
                <div className="flex justify-content-start">
                  <div className="m-2">
                    <Tag
                      value={rowData.orderStatus.label}
                      severity={rowData.orderStatus.severity}
                      className="text-sm"
                    />
                  </div>
                </div>
              );
            }}
          ></Column>
          <Column
            field="statuschangedate"
            header="Status Change Date"
            headerStyle={headerStyles}
            headerClassName="text-center "
            body={(rowData) => {
              return (
                <div className="flex justify-content-start">
                  {rowData.statusChangeDate
                    ? formatDate(rowData.statusChangeDate)
                    : ""}
                </div>
              );
            }}
          ></Column>
          <Column
            field="actions"
            header="Actions"
            headerStyle={headerStyles}
            headerClassName="text-center "
            body={actionsTemplate}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
};

export default Orders;
