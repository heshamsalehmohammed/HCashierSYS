import React, { useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { selectCurrentOrder } from "../../../redux/slices/ordersSlice";
import { formatDate, roundToNearestHalf } from "../../../services/utilities";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const OrderReceipt = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const currentOrder = useSelector(selectCurrentOrder);

  return (
    <div className="card flex justify-content-center">
      <Button
        icon="pi pi-external-link"
        className="mt-2 lg:mt-0 ml-1 mr-1 md:ml-0 md:mr-0"
        onClick={() => setVisible(true)}
      />
      <Dialog
        header={t("receipt")}
        headerClassName="pt-2 pb-2"
        visible={visible}
        style={{ width: "22rem", height: "100%" }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
        contentClassName="p-0"
      >
        <div className="receipt">
          <header className="receipt__header">
            <p className="receipt__title">{currentOrder.customer.name}</p>
            <p className="receipt__date">{currentOrder.customer.phone}</p>
            <p className="receipt__date">{formatDate(currentOrder.date)}</p>
          </header>
          <dl className="receipt__list">
            {currentOrder.items.map((item, currentOrderItemIndex) => {
              return (
                <div key={`orderitemsinrecipt-${currentOrderItemIndex}`}>
                  <div className="receipt__list-row">
                    <dt className="receipt__item">{`${item.amount} ${t(
                      "kilos"
                    )} ${item.stockItemName}`}</dt>
                    <dd className="receipt__cost">{`${item.price} ${t(
                      "currency"
                    )}`}</dd>
                  </div>
                  {item.count && (
                    <div className="receipt__list-row-details">
                      {t('theCount')} {item.count}
                    </div>
                  )}
                  {item.stockItemCustomizationsSelectedOptions.map(
                    (op, ind) => (
                      <div
                        key={`stockItemCustomizationsSelectedOptions-${ind}`}
                        className="receipt__list-row-details"
                      >
                        {`${op.stockItemCustomizationName} --- ${
                          op.stockItemCustomizationSelectedOptionName.includes(
                            "-"
                          )
                            ? op.stockItemCustomizationSelectedOptionName.replace(
                                "EGP",
                                " " + t("currency")
                              )
                            : op.stockItemCustomizationSelectedOptionName
                        }`}
                      </div>
                    )
                  )}
                </div>
              );
            })}

            <div className="receipt__list-row receipt__list-row--total">
              <dt className="receipt__item">{t("totalPrice")}</dt>
              <dd className="receipt__cost">
                {roundToNearestHalf(currentOrder.totalPrice)} {t("currency")}
              </dd>
            </div>
          </dl>
        </div>
      </Dialog>
    </div>
  );
};

export default OrderReceipt;
