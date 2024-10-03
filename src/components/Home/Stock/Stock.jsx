import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "primereact/button";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import {
  deleteStockItem,
  fetchStockItems,
  openAddStockItemPopup,
  prepareAndopenAddStockItemPopup,
  selectStockItems,
  selectStockSearchTerm,
  setStockSearchTerm,
} from "../../../redux/slices/stockSlice";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import _ from "lodash";
import CreateStockItemPopup from "./CreateStockItemPopup";

const Stock = (props) => {
  const { fromOrder = false } = props;
  const dispatch = useDispatch();

  const stockItems = useSelector(selectStockItems);

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

  useEffect(() => {
    if(!fromOrder){

      dispatch(fetchStockItems());
    }
  }, []);

  const actionsTemplate = (rowData) => {
    return (
      <div className="flex justify-content-start">
        {fromOrder ? (
          <>
          <Button
              icon="pi pi-plus"
              className="p-button-success mr-2"
              onClick={() => handleSelectItemForOrder(rowData)}
              label="Select Item"
            /></>
        ) : (
          <>
            <Button
              icon="pi pi-pencil"
              className="p-button-rounded p-button-success mr-2"
              onClick={() => handleEdit(rowData)}
              tooltip="Edit"
            />

            <Button
              icon="pi pi-trash"
              className="p-button-rounded p-button-danger"
              onClick={() => handleDelete(rowData)}
              tooltip="Delete"
            />
          </>
        )}
      </div>
    );
  };

  const handleEdit = (item) => {
    dispatch(prepareAndopenAddStockItemPopup(item._id));
  };

  const handleDelete = (item) => {
    dispatch(deleteStockItem(item._id));
  };


  const handleSelectItemForOrder = (item)=>{

  }

  return (
    <div className="">
      <CreateStockItemPopup />
      <div className={`surface-ground flex align-items-center justify-content-center flex-column ${fromOrder? "":" px-4 pb-8 pt-4 md:px-6 lg:px-8 "}`}>
        <div className="flex align-items-center justify-content-between w-full  flex-column md:flex-row">
          {!fromOrder && (
            <Button
              type="button"
              label="Add New Item"
              icon="pi pi-stockItems"
              outlined
              badgeClassName="p-badge-danger"
              className="mb-1"
              onClick={() => {
                dispatch(prepareAndopenAddStockItemPopup());
              }}
            />
          )}

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
          value={stockItems}
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
          {!fromOrder && (
            <Column
              field="amount"
              header="Available Amount In Stock By Kilo"
              headerStyle={headerStyles}
              headerClassName="text-center "
            ></Column>
          )}
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

export default Stock;
