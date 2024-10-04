import { useDispatch, useSelector } from "react-redux";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import {
  closeSelectStockItemForOrderPopup,
  editStockItem,
  selectAddStockItemPopup,
  setAddStockItemPopupAmount,
} from "../../../redux/slices/stockSlice";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { addStockItem } from "../../../redux/slices/stockSlice";
import { Dropdown } from "primereact/dropdown";
import {
  addStockItemToCurrentOrder,
  prepareAndCloseSelectStockItemForOrderPopup,
  selectSelectStockItemForOrderPopup,
  setSelectStockItemForOrderPopupAmount,
  setStockItemCustomizationsSelectedOption,
} from "../../../redux/slices/ordersSlice";
import { Divider } from "primereact/divider";

const StockItemForOrderPopup = () => {
  const dispatch = useDispatch();

  const stockItemState = useSelector(selectAddStockItemPopup);
  const stockItemForOrderPopupState = useSelector(
    selectSelectStockItemForOrderPopup
  );

  const headerElement = (
    <div className="inline-flex align-items-center justify-content-center gap-2">
      <span className="font-bold white-space-nowrap">
        {stockItemForOrderPopupState.itemIndexInOrder == null ?'Select':'Edit'} Stock Item: {stockItemState.name}
      </span>
    </div>
  );

  const footerContent = (
    <div>
      <Button
        label={stockItemForOrderPopupState.itemIndexInOrder == null?"Add Item To Current Order":'Edit Item In Current Order'}
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
        <span className="font-bold">Base Price: </span>{" "}
        <span>{stockItemForOrderPopupState.stockItemPrice} EGP</span>
      </div>
      <div className=" card flex justify-content-center align-items-center m-1 flex-column">
        <FloatLabel className="w-12 mt-5">
          <label htmlFor="itemamount">Amount</label>
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
                name: `${o.name} - ${o.additionalPrice}EGP`,
              };
            else return { ...o, name: `${o.name}` };
          });
          const currentStockItemCustomizationsSelectedOption =
            stockItemForOrderPopupState.stockItemCustomizationsSelectedOptions.find(
              (o) => o.stockItemCustomizationId === customization._id
            );

          const currentSelectedCustomizationOption = customizationOptions?.find(
            (o) =>
              o._id ===
              currentStockItemCustomizationsSelectedOption?.stockItemCustomizationSelectedOptionId??0
          )??undefined;

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
                  Select {customization.name}
                </label>
              </FloatLabel>
            </div>
          );
        })}
      </div>
      <Divider type="solid" />
      <div className="m-2 text-lg">
        <span className="font-bold">Total Price: </span>{" "}
        <span>{stockItemForOrderPopupState.price} EGP</span>
      </div>
    </Dialog>
  );
};

export default StockItemForOrderPopup;
