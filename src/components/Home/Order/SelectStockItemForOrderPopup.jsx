import { useDispatch, useSelector } from "react-redux";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { selectAddStockItemPopup } from "../../../redux/slices/stockSlice";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from "primereact/dropdown";
import {
  addStockItemToCurrentOrder,
  prepareAndCloseSelectStockItemForOrderPopup,
  selectSelectStockItemForOrderPopup,
  setSelectStockItemForOrderPopupAmount,
  setStockItemCustomizationsSelectedOption,
} from "../../../redux/slices/ordersSlice";
import { Divider } from "primereact/divider";
import { useTranslation } from "react-i18next";

const StockItemForOrderPopup = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const stockItemState = useSelector(selectAddStockItemPopup);
  const stockItemForOrderPopupState = useSelector(
    selectSelectStockItemForOrderPopup
  );

  const headerElement = (
    <div className="inline-flex align-items-center justify-content-center gap-2">
      <span className="font-bold white-space-nowrap">
        {stockItemForOrderPopupState.itemIndexInOrder == null
          ? t("select")
          : t("edit")}{" "}
        {t("stockItemInOrder")}: {stockItemState.name}
      </span>
    </div>
  );

  const footerContent = (
    <div>
      <Button
        label={
          stockItemForOrderPopupState.itemIndexInOrder == null
            ? t("addItemToCurrentOrder")
            : t("editItemInCurrentOrder")
        }
        icon="pi pi-check"
        onClick={() => dispatch(addStockItemToCurrentOrder())}
        autoFocus
      />
    </div>
  );

  return (
    <Dialog
      visible={stockItemForOrderPopupState.isShown}
      modal
      header={headerElement}
      footer={footerContent}
      style={{ width: "50rem" }}
      onHide={() => {
        if (!stockItemForOrderPopupState.isShown) return;
        dispatch(prepareAndCloseSelectStockItemForOrderPopup());
      }}
    >
      <div className="m-2 text-lg">
        <span className="font-bold">{t("basePrice")}: </span>{" "}
        <span>{stockItemForOrderPopupState.stockItemPrice} {t("currency")}</span>
      </div>
      <div className=" card flex justify-content-center align-items-center m-1 flex-column">
        <FloatLabel className="w-12 mt-5">
          <label htmlFor="itemamount">{t("amount")}</label>
          <InputText
            className="w-12"
            id="itemamount"
            value={stockItemForOrderPopupState.amount}
            onChange={(e) =>
              dispatch(setSelectStockItemForOrderPopupAmount(e.target.value))
            }
            keyfilter="pnum"
          />
        </FloatLabel>
        {stockItemState.customizations.map((customization, index) => {
          const customizationOptions = customization.options.map((o) => {
            if (o.additionalPrice)
              return {
                ...o,
                name: `${o.name} - ${o.additionalPrice} ${t("currency")}`,
              };
            else return { ...o, name: `${o.name}` };
          });
          const currentStockItemCustomizationsSelectedOption =
            stockItemForOrderPopupState.stockItemCustomizationsSelectedOptions.find(
              (o) => o.stockItemCustomizationId === customization._id
            );

          const currentSelectedCustomizationOption =
            customizationOptions?.find(
              (o) =>
                o._id ===
                currentStockItemCustomizationsSelectedOption?.stockItemCustomizationSelectedOptionId ?? 0
            ) ?? undefined;

          return (
            <div
              key={`stockItemCustomization-${index}`}
              className="mt-5 w-12 flex align-items-center justify-content-center"
            >
              <FloatLabel className="w-12">
                <Dropdown
                  inputId={`dd-stockItemCustomization-${index}`}
                  options={customizationOptions}
                  optionLabel="name"
                  className="w-full"
                  value={currentSelectedCustomizationOption}
                  onChange={(e) => {
                    dispatch(
                      setStockItemCustomizationsSelectedOption({
                        stockItemCustomizationId: customization._id,
                        stockItemCustomizationSelectedOptionId: e.value._id,
                        stockItemCustomizationSelectedOptionName: e.value.name,
                        stockItemCustomizationSelectedOptionAdditionalPrice:
                          e.value.additionalPrice,
                      })
                    );
                  }}
                />
                <label htmlFor={`dd-stockItemCustomization-${index}`}>
                  {t("select")} {customization.name}
                </label>
              </FloatLabel>
            </div>
          );
        })}
      </div>
      <Divider type="solid" />
      <div className="m-2 text-lg">
        <span className="font-bold">{t("totalPrice")}: </span>{" "}
        <span>{stockItemForOrderPopupState.price} {t("currency")}</span>
      </div>
    </Dialog>
  );
};

export default StockItemForOrderPopup;
