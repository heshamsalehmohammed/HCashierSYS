import { useDispatch, useSelector } from "react-redux";
import { Fieldset } from "primereact/fieldset";
import {
  closeSearchStockItemForOrderPopup,
  openSearchStockItemForOrderPopup,
  prepareAndOpenSelectStockItemForOrderPopup,
  removeStockItemFromCurrentOrder,
  selectCurrentOrder,
  selectSearchStockItemForOrderPopup,
} from "../../../redux/slices/ordersSlice";
import { Avatar } from "primereact/avatar";
import { Divider } from "primereact/divider";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";

import "./Order.scss";
import { useState } from "react";
import Stock from "../Stock/Stock";
import { Chip } from "primereact/chip";
import StockItemForOrderPopup from "./SelectStockItemForOrderPopup";

const Order = () => {
  const dispatch = useDispatch();
  const currentOrder = useSelector(selectCurrentOrder);
  const searchStockItemForOrderPopup = useSelector(
    selectSearchStockItemForOrderPopup
  );

  return (
    <div className="">
      <StockItemForOrderPopup />
      <div className="surface-ground px-4 pb-4 pt-4 md:px-6 lg:px-8 flex align-items-center justify-content-center flex-column">
        <Fieldset
          legend={
            <div className="flex align-items-center">
              <span className="font-bold">Customer Details</span>
            </div>
          }
          className="w-full custom-fieldset"
        >
          <div className="m-2 text-lg">
            <span className="font-bold">Name: </span>{" "}
            <span>{currentOrder.customer.name}</span>
          </div>
          <div className="m-2 text-lg">
            <span className="font-bold">Phone: </span>{" "}
            <span>{currentOrder.customer.phone}</span>
          </div>
          <div className="m-2 text-lg">
            <span className="font-bold">Address: </span>{" "}
            <span>{currentOrder.customer.address}</span>
          </div>
        </Fieldset>

        <Fieldset
          legend={
            <div className="flex align-items-center">
              <span className="font-bold mr-2">Order Details</span>
              <Button
                label="Add Item"
                icon="pi pi-plus"
                onClick={() => dispatch(openSearchStockItemForOrderPopup())}
              />
            </div>
          }
          className="mt-2 w-full custom-fieldset"
        >
          {currentOrder.items.map((item, currentOrderItemIndex) => {
            return (
              <div
                key={`currentOrderItem-${currentOrderItemIndex}`}
                className="flex align-items-center flex-wrap surface-ground p-3 mb-1"
              >
                <Button
                  icon="pi pi-angle-double-right"
                  className="m-1 mr-2 py-1"
                />

                <Chip
                  label={`${item.amount} kilos ${item.stockItemName} --- ${item.stockItemPrice} EGP`}
                  className="m-1 mr-2"
                />
                {item.stockItemCustomizationsSelectedOptions.map((op, ind) => (
                  <Chip
                    key={`stockItemCustomizationsSelectedOptions-${currentOrderItemIndex}-${ind}`}
                    label={`${
                      op.stockItemCustomizationName
                    } --- ${op.stockItemCustomizationSelectedOptionName.replace(
                      "EGP",
                      " EGP"
                    )}`}
                    className="m-1 mr-2"
                  />
                ))}
                <Chip
                  label={`Total Item Price ${item.price} EGP`}
                  className="m-1 mr-2"
                />
                <Button
                  icon="pi pi-pencil"
                  className="p-button-rounded p-button-success mr-2"
                  onClick={() =>
                    dispatch(
                      prepareAndOpenSelectStockItemForOrderPopup({
                        id: item.stockItemId,
                        oerderStockItem: {
                          ...item,
                          itemIndexInOrder: currentOrderItemIndex,
                        },
                      })
                    )
                  }
                  tooltip="Edit"
                />

                <Button
                  icon="pi pi-trash"
                  className="p-button-rounded p-button-danger"
                  onClick={() =>
                    dispatch(
                      removeStockItemFromCurrentOrder(currentOrderItemIndex)
                    )
                  }
                  tooltip="Delete"
                />
              </div>
            );
          })}
          <Divider type="solid" />
          <div className="m-2 text-lg">
            <span className="font-bold">Total Price: </span>
            <span>{currentOrder.totalPrice} EGP</span>
          </div>
        </Fieldset>
        <Button
          label="Submit Order"
          icon="pi pi-plus"
          className="mt-4 align-self-end"
          onClick={() => {}}
        />
      </div>
      <Sidebar
        visible={searchStockItemForOrderPopup.isShown}
        position="bottom"
        onHide={() => dispatch(closeSearchStockItemForOrderPopup())}
        className="custom-downbar"
      >
        <Stock fromOrder />
      </Sidebar>
    </div>
  );
};

export default Order;
