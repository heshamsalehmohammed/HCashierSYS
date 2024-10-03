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

const SelectStockItemForOrderPopup = () => {
  const dispatch = useDispatch();

  const addStockItemPopup = useSelector(selectAddStockItemPopup);

  const headerElement = (
    <div className="inline-flex align-items-center justify-content-center gap-2">
      <span className="font-bold white-space-nowrap">Select Stock Item: {addStockItemPopup.name}</span>
    </div>
  );

  const footerContent = (
    <div>
      <Button
        label={'Add To Current Order'}
        icon="pi pi-check"
        onClick={() => {
          if(addStockItemPopup._id){
            dispatch(editStockItem());
          }else{

            dispatch(addStockItem());
          }
        }}
        autoFocus
      />
    </div>
  );

  return (
    <Dialog
      visible={addStockItemPopup.isShown}
      modal
      header={headerElement}
      footer={footerContent}
      style={{ width: "50rem" }}
      onHide={() => {
        if (!addStockItemPopup.isShown) return;
        dispatch(closeSelectStockItemForOrderPopup());
      }}
    >
      <div className=" card flex justify-content-center align-items-center mt-5 flex-column">
        <FloatLabel className="w-12 w-12 md:w-8 mb-4">
          <label htmlFor="itemamount">Amount</label>
          <InputText
            className="w-12"
            id="itemamount"
            value={addStockItemPopup.amount}
            onChange={(e) =>
              dispatch(setAddStockItemPopupAmount(e.target.value))
            }
            keyfilter="pnum"
          />
        </FloatLabel>
      </div>
      <div className=" card flex justify-content-center align-items-center m-1 flex-column">
        {addStockItemPopup.customizations.map((customization, index) => {
          return (
            <div
              key={`stockItemCustomization-${index}`}
              className="pt-4 w-full flex align-items-center justify-content-center"
            >
              <FloatLabel className="w-10 m-1">
                <Dropdown
                  inputId={`dd-stockItemCustomization-${index}`}
                  options={customization.options.map((o) => {
                    if (o.additionalPrice)
                      return { name: `${o.name} - ${o.additionalPrice}EGP` };
                    else return { name: `${o.name}` };
                  })}
                  optionLabel="name"
                  className="w-full"
                />
                <label htmlFor={`dd-stockItemCustomization-${index}`}>
                  Select {customization.name}
                </label>
              </FloatLabel>
            </div>
          );
        })}
      </div>
    </Dialog>
  );
};

export default SelectStockItemForOrderPopup;
