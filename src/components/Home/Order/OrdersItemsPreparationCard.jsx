/* eslint-disable react/react-in-jsx-scope */
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrdersItemsPreperations,
  selectOrdersItemsPreperations,
} from "../../../redux/slices/ordersSlice";
import { prepareAndopenAddStockItemPopup } from "../../../redux/slices/stockSlice";
import { useTranslation } from "react-i18next";
import CreateStockItemPopup from "../Stock/CreateStockItemPopup";

const OrdersItemsPreparationCard = () => {
  const { t } = useTranslation();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const tableCardRef = useRef(null);
  const ordersItemsPreperations = useSelector(selectOrdersItemsPreperations);
  const dispatch = useDispatch();

  const toggleFullScreen = () => {
    const elem = tableCardRef.current;

    if (!isFullScreen) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    setIsFullScreen(!isFullScreen);
  };

  useEffect(() => {
    dispatch(fetchOrdersItemsPreperations());
  }, []);

  const handleEdit = (item) => {
    dispatch(prepareAndopenAddStockItemPopup(item.stockItemId));
  };

  return (
    <>
      <CreateStockItemPopup />
      <Card
      style={{width:'100%'}}
        className={`p-relative orders-items-prep shadow-8 ${
          isFullScreen ? "h-full" : ""
        }`}
        ref={tableCardRef}
        id={isFullScreen ? "FullScreenContainer" : ""}
        header={() => (
          <div className="p-card-title p-4 pb-0 flex justify-content-between">
            <div>{t("ordersItemsPreparation")}</div>
            <Button
              icon={isFullScreen ? "pi pi-times" : "pi pi-arrows-alt"}
              className="p-button-rounded p-button-info p-absolute p-topright"
              onClick={toggleFullScreen}
            />
          </div>
        )}
      >
        <DataTable
          value={ordersItemsPreperations}
          emptyMessage={t("noAvailableRecords")}
          scrollable={true}
          scrollHeight={isFullScreen ? '80vh' : "50vh"}
          
        >
          <Column field="stockItemName" header={t("itemName")} />
          <Column field="stockItemQuantity" header={t("inStock")} />
          <Column field="requiredQuantity" header={t("needToBuy")} />
          <Column
            field="stockItemCountDetails"
            header={t("stockItemCountDetails")}
            width={200}
            body={(rowData) => {
              if(!rowData.stockItemCountDetails?.totalCount) return '';
              return (
                <div className="flex justify-content-start" style={{minWidth:'125px'}}>
                  <div className="m-2">
                    <span className="font-bold">{t("totalCount")}: </span>
                    <span>{rowData.stockItemCountDetails.totalCount}</span>
                    {rowData.stockItemCountDetails.customizationsOptionsCount.map(
                      (o, index) => {
                        if(!o.count) return '';
                        return (
                          <div key={`customizationsOptionsCount-${index}`}>
                            <span className="font-bold">
                              {o.stockItemCustomizationSelectedOptionName} :
                            </span>
                            <span>
                              {o.count}
                            </span>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              );
            }}
          />
          {/* <Column
            field="actions"
            header=""
            body={(rowData) => {
              return (
                <div className="flex justify-content-start">
                  <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-success mr-2"
                    onClick={() => handleEdit(rowData)}
                    tooltip={t("edit")}
                  />
                </div>
              );
            }}
          /> */}
        </DataTable>
      </Card>
    </>
  );
};

export default OrdersItemsPreparationCard;
