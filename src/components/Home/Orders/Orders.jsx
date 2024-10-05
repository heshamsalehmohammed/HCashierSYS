import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import _ from "lodash";
import {
  ComparisonOperators,
  fetchOrders,
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
            onClick={() => dispatch(prepareAndOpenOrderPage(rowData._id))}
            tooltip={t("edit")}
          />
        </>
      </div>
    );
  };

  const handleFilterChange = async (key, value, filterMatchMode) => {
    if (typeof key === "object") {
      await dispatch(setOrdersFilterCriteria(key));
    } else {
      await dispatch(
        setOrdersFilterCriteria({
          [key]: { value, filterMatchMode },
        })
      );
    }

    debouncedFetch();
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
        onChange={async (e) =>
          await handleFilterChange(
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
        value={ordersFilters.customerName.value ?? undefined}
        onChange={async (e) =>
          await handleFilterChange(
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
        value={ordersFilters.customerPhone.value ?? undefined}
        onChange={async (e) =>
          await handleFilterChange(
            "customerPhone",
            e.target.value ?? null,
            ComparisonOperators.CONTAINS
          )
        }
      />
    );
  };

  const totalPriceRowFilterTemplate = (options) => {
    return (
      <InputText
        placeholder={t("search")}
        keyfilter="pnum"
        className="p-column-filter"
        style={{ minWidth: "4rem" }}
        value={ordersFilters.totalPrice.value ?? undefined}
        onChange={async (e) =>
          await handleFilterChange(
            "totalPrice",
            e.target.value ?? null,
            options.filterModel.matchMode
          )
        }
      />
    );
  };

  const dateRowFilterTemplate = (options) => {
    return (
      <Calendar
        showTime
        hourFormat="12"
        className="p-column-filter"
        style={{ minWidth: "4rem" }}
        value={ordersFilters.date.value}
        onChange={async (e) =>
          await handleFilterChange(
            "date",
            e.target.value ?? null,
            options.filterModel.matchMode
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
        onChange={async (e) =>
          await handleFilterChange(
            "statusChangeDate",
            e.target.value ?? null,
            options.filterModel.matchMode
          )
        }
      />
    );
  };

  const onPage = async (event) => {
    await handleFilterChange({
      pageNumber: event.page, // Convert 0-based index to 1-based for backend
      pageSize: event.rows, // Keep the page size
    });
  };

  return (
    <div className="">
      <div className="surface-ground px-4 pb-8 pt-4 md:px-6 lg:px-8 flex align-items-center justify-content-center flex-column">
        <DataTable
          value={orders}
          stripedRows
          className="w-12 m-auto shadow-7"
          style={tableStyles}
          paginator
          rows={ordersFilters.pageSize}
          totalRecords={totalRecords}
          onPage={onPage}
          rowsPerPageOptions={[5, 10, 15, 25, 50]}
          filterDisplay="row"
          emptyMessage={t("noAvailableRecords")}
        >
          <Column
            field="customername"
            header={t("customerName")}
            headerStyle={headerStyles}
            headerClassName="text-center "
            body={(rowData) => {
              return (
                <div className="flex justify-content-start">
                  {rowData.customer.name}
                </div>
              );
            }}
            filter
            showFilterMenu={false}
            filterElement={customerNameRowFilterTemplate}
          ></Column>

          <Column
            field="customerphone"
            header={t("customerPhone")}
            headerStyle={headerStyles}
            headerClassName="text-center "
            body={(rowData) => {
              return (
                <div className="flex justify-content-start">
                  {rowData.customer.phone}
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
