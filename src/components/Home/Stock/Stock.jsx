import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "primereact/button";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import {
  deleteStockItem,
  fetchStockItems,
  prepareAndopenAddStockItemPopup,
  selectStockItems,
  selectStockSearchTerm,
  setStockSearchTerm,
} from "../../../redux/slices/stockSlice";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import _ from "lodash";
import CreateStockItemPopup from "./CreateStockItemPopup";
import { prepareAndOpenSelectStockItemForOrderPopup } from "../../../redux/slices/ordersSlice";
import { useTranslation } from "react-i18next";

const Stock = (props) => {
  const { fromOrder = false } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const stockItems = useSelector(selectStockItems);
  const serachTermValue = useSelector(selectStockSearchTerm);

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
      dispatch(fetchStockItems());
    }, 300),
    [dispatch]
  );

  useEffect(() => {
    if (!fromOrder) {
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
              label={t("selectItem")}
            />
          </>
        ) : (
          <>
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

  const handleSelectItemForOrder = (item) => {
    dispatch(prepareAndOpenSelectStockItemForOrderPopup({ id: item._id }));
  };

  return (
    <div className="">
      <CreateStockItemPopup />
      <div
        className={`surface-ground flex align-items-center justify-content-center flex-column ${
          fromOrder ? "" : " px-4 pb-8 pt-4 md:px-6 lg:px-8 "
        }`}
      >
        <div className="flex align-items-center justify-content-between w-full  flex-column md:flex-row">
          {!fromOrder && (
            <Button
              type="button"
              label={t("addNewItem")}
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
              placeholder={t("searchByName")}
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
          emptyMessage={t("noAvailableRecords")}
        >
          <Column
            field="name"
            header={t("name")}
            headerStyle={headerStyles}
            headerClassName="text-center "
          ></Column>
          <Column
            field="amount"
            header={t("availableAmountInStockByKilo")}
            headerStyle={headerStyles}
            headerClassName="text-center "
          ></Column>
          <Column
            field="price"
            header={t("basePrice")}
            headerStyle={headerStyles}
            headerClassName="text-center "
            body={(rowData) => {
              return (
                <div className="flex justify-content-start">
                  {rowData.price} {t("currency")}
                </div>
              );
            }}
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
    </div>
  );
};

export default Stock;
