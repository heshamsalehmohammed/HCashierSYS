/* eslint-disable react/react-in-jsx-scope */
import { useDispatch, useSelector } from "react-redux";
import { Fieldset } from "primereact/fieldset";
import {
  OrderStatusEnum,
  addOrder,
  closeSearchStockItemForOrderPopup,
  editOrder,
  openSearchStockItemForOrderPopup,
  prepareAndOpenSelectStockItemForOrderPopup,
  removeStockItemFromCurrentOrder,
  selectCurrentOrder,
  selectOrderStatues,
  selectSearchStockItemForOrderPopup,
} from "../../../redux/slices/ordersSlice";
import { Button } from "primereact/button";
import "./Order.scss";
import StockItemForOrderPopup from "./SelectStockItemForOrderPopup";
import { Tag } from "primereact/tag";
import { Divider } from "primereact/divider";
import { Chip } from "primereact/chip";
import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from "primereact/dropdown";
import { formatDate, roundToNearestHalf } from "../../../services/utilities";
import { useTranslation } from "react-i18next";
import { Message } from "primereact/message";
import { Sidebar } from "primereact/sidebar";
import Stock from "../Stock/Stock";
import OrderReceipt from "./OrderReceipt";

const Order = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const currentOrder = useSelector(selectCurrentOrder);
  const orderStatues = useSelector(selectOrderStatues);
  const searchStockItemForOrderPopup = useSelector(
    selectSearchStockItemForOrderPopup
  );

  const canChangeOrderStatus =
    currentOrder.orderStatusId !== 0 &&
    currentOrder.orderStatusId !== OrderStatusEnum.DELIVERED && 
    currentOrder.orderStatusId !== OrderStatusEnum.CANCELED;

  const canAddItemToOrder =
    currentOrder.orderStatusId === OrderStatusEnum.INITIALIZED ||
    currentOrder.orderStatusId === OrderStatusEnum.PROCESSING ||
    currentOrder.orderStatusId === 0;

  const canEditOrDeleteItemInOrder =
    currentOrder.orderStatusId === OrderStatusEnum.INITIALIZED ||
    currentOrder.orderStatusId === OrderStatusEnum.PROCESSING ||
    currentOrder.orderStatusId === 0;

  const isStatusMessageNotTakingFullWidth =
    currentOrder.orderStatusId === OrderStatusEnum.INITIALIZED ||
    currentOrder.orderStatusId === OrderStatusEnum.PROCESSING ||
    currentOrder.orderStatusId === 0;

  const showSubmitOrEditButton =
    currentOrder.orderStatusId === OrderStatusEnum.INITIALIZED ||
    currentOrder.orderStatusId === OrderStatusEnum.PROCESSING ||
    currentOrder.orderStatusId === 0;

  const isSubmitOrEditButtonInEdit =
    currentOrder.orderStatusId === OrderStatusEnum.INITIALIZED ||
    currentOrder.orderStatusId === OrderStatusEnum.PROCESSING;

  return (
    <div className="">
      <StockItemForOrderPopup />
      <div className={` pb-4 ${canChangeOrderStatus?'pt-4':''} md:px-6 lg:px-8 flex align-items-center justify-content-center flex-column`}>
        {canChangeOrderStatus && (
          <FloatLabel className="w-3 m-1 -mt-6" style={{ minWidth: "276px" }}>
            <Dropdown
              inputId={`dd-orderstatues`}
              options={orderStatues}
              optionLabel="name"
              className="w-full"
              value={orderStatues.find(
                (o) => o._id === currentOrder.orderStatusId
              )}
              onChange={(e) => {
                dispatch(
                  editOrder({
                    orderStatusId: e.value._id,
                    orderStatus: e.value,
                  })
                );
              }}
              optionDisabled={(option)=>{
                if(currentOrder.orderStatusId === OrderStatusEnum.PROCESSING && option._id === OrderStatusEnum.INITIALIZED ){
                  return true;
                }
                return false
              }}
            />
          </FloatLabel>
        )}
        <Fieldset
          legend={
            <div className="flex align-items-center">
              <span className="font-bold">{t("customerDetails")}</span>
              
            </div>
          }
          className="w-full custom-fieldset"
        >
          <div className="m-2 text-lg">
            <span className="font-bold">{t("name")}: </span>{" "}
            <span>{currentOrder.customer.name}</span>
          </div>
          <div className="m-2 text-lg">
            <span className="font-bold">{t("phone")}: </span>{" "}
            <span>{currentOrder.customer.phone}</span>
          </div>
          <div className="m-2 text-lg">
            <span className="font-bold">{t("address")}: </span>{" "}
            <span>{currentOrder.customer.address}</span>
          </div>
        </Fieldset>

        <Fieldset
          legend={
            <div className="flex align-items-center">
              <span className="font-bold mr-2">{t("orderDetails")}</span>
              {canAddItemToOrder && (
                <Button
                  label={t("addItem")}
                  icon="pi pi-plus"
                  onClick={() => dispatch(openSearchStockItemForOrderPopup())}
                />
              )}
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
                  label={`${item.count ? `${t('count')} ${item.count} - ` : `` }${item.amount} ${t("kilos")} ${
                    item.stockItemName
                  } --- ${item.stockItemPrice} ${t("currency")}`}
                  className="m-1 mr-2"
                />
                {item.stockItemCustomizationsSelectedOptions.map((op, ind) => (
                  <Chip
                    key={`stockItemCustomizationsSelectedOptions-${currentOrderItemIndex}-${ind}`}
                    label={`${op.stockItemCustomizationName} --- ${
                      op.stockItemCustomizationSelectedOptionName.includes("-")
                        ? op.stockItemCustomizationSelectedOptionName.replace(
                            "EGP",
                            " " + t("currency")
                          )
                        : op.stockItemCustomizationSelectedOptionName +
                          " - " +
                          op.stockItemCustomizationSelectedOptionAdditionalPrice +
                          " " +
                          t("currency")
                    }`}
                    className="m-1 mr-2"
                  />
                ))}
                <Chip
                  label={`${t("totalItemPrice")} ${roundToNearestHalf(item.price)} ${t(
                    "currency"
                  )}`}
                  className="m-1 mr-2"
                />
                {canEditOrDeleteItemInOrder && (
                  <>
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
                      tooltip={t("edit")}
                    />

                    <Button
                      icon="pi pi-trash"
                      className="p-button-rounded p-button-danger"
                      onClick={() =>
                        dispatch(
                          removeStockItemFromCurrentOrder(currentOrderItemIndex)
                        )
                      }
                      tooltip={t("delete")}
                    />
                  </>
                )}
              </div>
            );
          })}
          <Divider type="solid" />
          <div className="m-2 text-lg">
            <span className="font-bold">{t("initializationDate")}: </span>{" "}
            <span>{formatDate(currentOrder.date)}</span>
          </div>
          {currentOrder.statusChangeDate && (
            <div className="m-2 text-lg">
              <span className="font-bold">{t("statusChangeDate")}: </span>{" "}
              <span>{formatDate(currentOrder.statusChangeDate)}</span>
            </div>
          )}
          {currentOrder.updatedDate && (
            <div className="m-2 text-lg">
              <span className="font-bold">{t("updateDate")}: </span>{" "}
              <span>{formatDate(currentOrder.updatedDate)}</span>
            </div>
          )}
          <Divider type="solid" />
          <div className="m-2 text-lg">
            <span className="font-bold">{t("totalPrice")}: </span>
            <span>
              {roundToNearestHalf(currentOrder.totalPrice)} {t("currency")}
            </span>
          </div>
        </Fieldset>
        <div
          className={`flex lg:justify-content-between justify-content-center  align-items-center w-full mt-3 flex-wrap`}
        >
          {currentOrder.orderStatusId != 0 && (
            <Message
              style={{
                border: "solid #696cff",
                borderWidth: "0 0 0 6px",
                color: "#696cff",
              }}
              className={`border-primary justify-content-start ${
                isStatusMessageNotTakingFullWidth ? "w-10" : "w-full"
              }`}
              severity="info"
              content={
                <div className="flex align-items-center">
                  <span className="font-bold">{t("orderStatus")}: </span>
                  <div className="ml-2">
                    <Tag
                      value={currentOrder.orderStatus.label}
                      severity={currentOrder.orderStatus.severity}
                      className="text-sm"
                    />
                  </div>
                </div>
              }
            />
          )}

          {showSubmitOrEditButton && (
            <Button
              label={`${
                isSubmitOrEditButtonInEdit ? t("editOrder") : t("submitOrder")
              }`}
              icon="pi pi-plus"
              className="mt-2 lg:mt-0"
              onClick={() => {
                if (currentOrder.orderStatusId != 0 && currentOrder._id) {
                  dispatch(editOrder());
                } else {
                  dispatch(addOrder());
                }
              }}
            />
          )}
          <OrderReceipt/>
        </div>
      </div>
      <Sidebar
        visible={searchStockItemForOrderPopup.isShown}
        position="top"
        onHide={() => dispatch(closeSearchStockItemForOrderPopup())}
        className="custom-downbar"
      >
        <Stock fromOrder />
      </Sidebar>
    </div>
  );
};

export default Order;
