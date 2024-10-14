/* eslint-disable react/react-in-jsx-scope */
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import _ from "lodash";
import {
  ComparisonOperators,
  fetchOrders,
  getEmptyOrdersFiltersCriteria,
  prepareAndOpenOrderPage,
  selectOrderStatues,
  selectOrders,
  selectOrdersFilterCriteria,
  selectOrdersTotalRecords,
  setOrdersFilterCriteria,
} from "../../../redux/slices/ordersSlice";
import { Tag } from "primereact/tag";
import { formatDate } from "../../../services/utilities";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { useTranslation } from "react-i18next";
import { Paginator } from "primereact/paginator";
import './Orders.scss'

const Orders = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const orders = useSelector(selectOrders);
  const totalRecords = useSelector(selectOrdersTotalRecords);
  const ordersFilters = useSelector(selectOrdersFilterCriteria);
  const orderStatues = useSelector(selectOrderStatues);

  const tableStyles = {
    backgroundColor: "#333",
    color: "#fff",
  };

  const headerStyles = {
    backgroundColor: "#444",
    color: "#fff",
  };


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
            onClick={() => dispatch(prepareAndOpenOrderPage(rowData._id))}
            tooltip={t("edit")}
          />
        </>
      </div>
    );
  };

  const handleFilterChange =  (key, value, filterMatchMode) => {
    if (typeof key === "object") {
       dispatch(setOrdersFilterCriteria(key));
    } else {
       dispatch(
        setOrdersFilterCriteria({
          [key]: { value, filterMatchMode },
        })
      );
    }

  };

  const statusBodyTemplate = (rowData) => {
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
  };
  const statusItemTemplate = (option) => {
    return (
      <div className="m-2">
        <Tag
          value={option.label}
          severity={option.severity}
          className="text-sm"
        />
      </div>
    );
  };
  const statusRowFilterTemplate = (options) => {
    const selectedOption = orderStatues.find(
      (o) => o._id === ordersFilters.orderStatusId.value
    );
    return (
      <Dropdown
        value={selectedOption}
        options={orderStatues}
        onChange={ (e) =>
           handleFilterChange(
            "orderStatusId",
            e.value?._id ?? null,
            ComparisonOperators.EQUALS
          )
        }
        itemTemplate={statusItemTemplate}
        placeholder={t("selectOne")}
        className="p-column-filter"
        showClear
        style={{ minWidth: "8rem" }}
      />
    );
  };

  const customerNameRowFilterTemplate = (options) => {
    return (
      <InputText
        placeholder={t("search")}
        className="p-column-filter"
        style={{ minWidth: "4rem" }}
        value={ordersFilters.customerName.value ?? ''}
        onChange={ (e) =>
           handleFilterChange(
            "customerName",
            e.target.value ?? null,
            ComparisonOperators.CONTAINS
          )
        }
      />
    );
  };

  const customerPhoneRowFilterTemplate = (options) => {
    return (
      <InputText
        placeholder={t("search")}
        className="p-column-filter"
        style={{ minWidth: "4rem" }}
        value={ordersFilters.customerPhone.value ?? ''}
        onChange={ (e) =>
           handleFilterChange(
            "customerPhone",
            e.target.value ?? null,
            ComparisonOperators.CONTAINS
          )
        }
      />
    );
  };

  const totalPriceRowFilterTemplate = useCallback((options) => {
    return (
      <InputText
        placeholder={t("search")}
        keyfilter="pnum"
        className="p-column-filter"
        style={{ minWidth: "4rem" }}
        value={ordersFilters.totalPrice.value ?? ''}
        onChange={ (e) =>
           handleFilterChange(
            "totalPrice",
            e.target.value ?? null,
            options?.filterModel?.matchMode??null
          )
        }
      />
    );
  },[ordersFilters]);

  const dateRowFilterTemplate = (options) => {
    return (
      <Calendar
        showTime
        hourFormat="12"
        className="p-column-filter"
        style={{ minWidth: "4rem" }}
        value={ordersFilters.date.value}
        onChange={ (e) =>
           handleFilterChange(
            "date",
            e.target.value ?? null,
            options?.filterModel?.matchMode??null
          )
        }
      />
    );
  };

  const statusChangeDateRowFilterTemplate = (options) => {
    return (
      <Calendar
        showTime
        hourFormat="12"
        className="p-column-filter"
        style={{ minWidth: "4rem" }}
        value={ordersFilters.statusChangeDate.value}
        onChange={ (e) =>
           handleFilterChange(
            "statusChangeDate",
            e.target.value ?? null,
            options?.filterModel?.matchMode??null
          )
        }
      />
    );
  };
  const [first, setFirst] = useState(0);

  const onPage =  (event) => {
    setFirst(event.first);
     handleFilterChange({
      pageNumber: event.page, // Convert 0-based index to 1-based for backend
      pageSize: event.rows, // Keep the page size
    });
  };

  return (
    <div className="">
      <div className=" pb-1 pt-4 md:px-6 lg:px-8 flex align-items-center justify-content-center flex-column">
        <DataTable
          value={orders}
          stripedRows
          className="w-12 m-auto shadow-7 orders-table"
          style={tableStyles}
          /* paginator */
          rows={ordersFilters.pageSize}
          totalRecords={totalRecords}
          filterDisplay="row"
          emptyMessage={t("noAvailableRecords")}
          filters={{
            totalprice: { value: null, matchMode: null },
        }}
        scrollable
        scrollHeight="70vh"
        header={
          <div className="flex flex-wrap align-items-center justify-content-end gap-2" style={{
            position:'absolute',
            top:'-50px'
          }}>
            <Button icon="pi pi-times" rounded raised tooltip={t("clearAllFilters")} onClick={()=>{
              dispatch(setOrdersFilterCriteria(getEmptyOrdersFiltersCriteria()));
            }}/>
            <Button icon="pi pi-refresh" rounded raised tooltip={t("refresh")}  onClick={()=>{
              dispatch(fetchOrders());
            }}/>
        </div>
        }
        footer={
          <Paginator first={first} rows={ordersFilters.pageSize} totalRecords={totalRecords} rowsPerPageOptions={[5,10, 20, 30]} onPageChange={onPage} />
        }
        >
          <Column
            field="customername"
            header={t("customerName")}
            headerStyle={headerStyles}
            headerClassName="text-center "
            body={(rowData) => {
              return (
                <div className="flex justify-content-start">
                  {rowData.customer?.name}
                </div>
              );
            }}
            filter
            showFilterMenu={false}
            filterElement={customerNameRowFilterTemplate}
            frozen 
          ></Column>

          <Column
            field="customerphone"
            header={t("customerPhone")}
            headerStyle={headerStyles}
            headerClassName="text-center "
            body={(rowData) => {
              return (
                <div className="flex justify-content-start">
                  {rowData.customer?.phone}
                </div>
              );
            }}
            filter
            showFilterMenu={false}
            filterElement={customerPhoneRowFilterTemplate}
          ></Column>

          <Column
            field="totalprice"
            header={t("totalPrice")}
            headerStyle={headerStyles}
            headerClassName="text-center "
            body={(rowData) => {
              return (
                <div className="flex justify-content-start">
                  {rowData.totalPrice} {t("currency")}
                </div>
              );
            }}
            filter
            filterElement={totalPriceRowFilterTemplate}
            dataType="numeric"
            onFilterMatchModeChange={(param)=> handleFilterChange(
              "totalPrice",
              ordersFilters.totalPrice.value,
              param.matchMode
            )}
            onFilterClear={()=>
               handleFilterChange(
                "totalPrice",
                 null,
                null
              )
            }
          ></Column>

          <Column
            field="date"
            header={t("orderDate")}
            headerStyle={headerStyles}
            headerClassName="text-center "
            body={(rowData) => {
              return (
                <div className="flex justify-content-start">
                  {formatDate(rowData.date)}
                </div>
              );
            }}
            filter
            filterElement={dateRowFilterTemplate}
            dataType="date"
            onFilterMatchModeChange={(param)=> handleFilterChange(
              "date",
              ordersFilters.date.value,
              param.matchMode
            )}
            onFilterClear={()=>
               handleFilterChange(
                "date",
                 null,
                null
              )
            }
          ></Column>
          <Column
            field="status"
            header={t("status")}
            headerStyle={headerStyles}
            headerClassName="text-center "
            showFilterMenu={false}
            filterMenuStyle={{ width: "14rem" }}
            style={{ minWidth: "12rem" }}
            body={statusBodyTemplate}
            filter
            filterElement={statusRowFilterTemplate}
          ></Column>
          <Column
            field="statuschangedate"
            header={t("statusChangeDate")}
            headerStyle={headerStyles}
            headerClassName="text-center "
            body={(rowData) => {
              return (
                <div className="flex justify-content-start">
                  {formatDate(rowData.statusChangeDate)}
                </div>
              );
            }}
            filter
            filterElement={statusChangeDateRowFilterTemplate}
            dataType="date"
            onFilterMatchModeChange={(param)=> handleFilterChange(
              "statusChangeDate",
              ordersFilters.statusChangeDate.value,
              param.matchMode
            )}
            onFilterClear={()=>
               handleFilterChange(
                "statusChangeDate",
                 null,
                null
              )
            }
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

export default Orders;
