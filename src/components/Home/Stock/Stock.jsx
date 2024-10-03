import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "primereact/button";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import {
  fetchStockItems,
  openAddStockItemPopup,
  selectStockItems,
  selectStockSearchTerm,
  setStockSearchTerm,
} from "../../../redux/slices/stockSlice";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import _ from "lodash";
import CreateStockItemPopup from "./CreateStockItemPopup";

const Stock = () => {
  const dispatch = useDispatch();

  const customers = useSelector(selectStockItems);

  const serachTermValue = useSelector(selectStockSearchTerm);

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
      dispatch(fetchStockItems());
    }, 300),
    [dispatch]
  );

  return (
    <div className="">
      <CreateStockItemPopup />
      <div className="surface-ground px-4 pb-8 pt-4 md:px-6 lg:px-8 flex align-items-center justify-content-center flex-column">
        <div className="flex align-items-center justify-content-between w-full  flex-column md:flex-row">
          <Button
            type="button"
            label="Add New Item"
            icon="pi pi-customers"
            outlined
            badgeClassName="p-badge-danger"
            className="mb-1"
            onClick={() => {
              dispatch(openAddStockItemPopup());
            }}
          />

          <IconField iconPosition="left" className="mb-1">
            <InputIcon className="pi pi-search"> </InputIcon>
            <InputText
              placeholder="Search by name"
              onChange={(e) => {
                dispatch(setStockSearchTerm(e.target.value));
                debouncedFetch();
              }}
              value={serachTermValue}
            />
          </IconField>
        </div>
        <DataTable
          value={customers}
          stripedRows
          className="w-12 m-auto shadow-7"
          style={tableStyles}
        >
          <Column
            field="name"
            header="Name"
            headerStyle={headerStyles}
            headerClassName="text-center "
          ></Column>
          <Column
            field="amountInStock"
            header="Amount In Stock By Kilo"
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
    </div>
  );
};

export default Stock;
