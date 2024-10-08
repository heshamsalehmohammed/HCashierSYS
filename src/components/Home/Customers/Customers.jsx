/* eslint-disable react/react-in-jsx-scope */
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "primereact/button";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import {
  deleteCustomer,
  fetchCustomers,
  handleNewOrderForCustomerButtonClick,
  prepareAndopenAddCustomerPopup,
  selectCustomers,
  selectCustomersSearchTerm,
  setCustomersSearchTerm,
} from "../../../redux/slices/customersSlice";
import CreateCustomerPopup from "./CreateCustomerPopup";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import _ from "lodash";
import { useTranslation } from "react-i18next";

const Customers = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const customers = useSelector(selectCustomers);
  const serachTermValue = useSelector(selectCustomersSearchTerm);

  const tableStyles = {
    backgroundColor: "#333",
    color: "#fff",
  };

  const headerStyles = {
    backgroundColor: "#444",
    color: "#fff",
  };

  const debouncedFetch = useCallback(
    _.debounce(() => {
      dispatch(fetchCustomers());
    }, 300),
    [dispatch]
  );

  const actionsTemplate = (rowData) => {
    return (
      <div className="flex justify-content-start">
        <Button
          icon="pi pi-plus"
          label={t("newOrder")}
          className=" p-button-success mr-2"
          onClick={() => handleNewOrder(rowData)}
          tooltip={t("newOrder")}
        />
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => handleEdit(rowData)}
          tooltip={t("edit")}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger"
          onClick={() => handleDelete(rowData)}
          tooltip={t("delete")}
        />
      </div>
    );
  };

  const handleEdit = (item) => {
    dispatch(prepareAndopenAddCustomerPopup(item._id));
  };

  const handleDelete = (item) => {
    dispatch(deleteCustomer(item._id));
  };

  const handleNewOrder = (item) => {
    dispatch(handleNewOrderForCustomerButtonClick({ customer: item }));
  };

  return (
    <div className="">
      <CreateCustomerPopup />
      <div className=" px-4 pb-8 pt-4 md:px-6 lg:px-8 flex align-items-center justify-content-center flex-column">
        <Button
          type="button"
          label={t("addNewCustomer")}
          icon="pi pi-customers"
          outlined
          badgeClassName="p-badge-danger"
          className="mb-4"
          onClick={() => {
            dispatch(prepareAndopenAddCustomerPopup());
          }}
        />

        <div className="m-1">{t("searchForExistingCustomer")}</div>
        <IconField iconPosition="left" className="mt-0 m-3">
          <InputIcon className="pi pi-search"> </InputIcon>
          <InputText
            placeholder={t("searchByNumberOrName")}
            onChange={(e) => {
              dispatch(setCustomersSearchTerm(e.target.value));
              debouncedFetch();
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
        emptyMessage={t("noAvailableRecords")}
      >
        <Column
          field="phone"
          header={t("phone")}
          headerStyle={headerStyles}
          headerClassName="text-center "
        ></Column>
        <Column
          field="name"
          header={t("name")}
          headerStyle={headerStyles}
          headerClassName="text-center "
        ></Column>
        <Column
          field="actions"
          header={t("actions")}
          headerStyle={headerStyles}
          headerClassName="text-center "
          body={actionsTemplate}
        ></Column>
      </DataTable>
    </div>
  );
};

export default Customers;
