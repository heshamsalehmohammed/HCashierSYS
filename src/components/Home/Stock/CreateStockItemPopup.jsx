import { useDispatch, useSelector } from "react-redux";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import {
  closeAddStockItemPopup,
  editStockItem,
  openAddStockItemCustomizationPopup,
  removeStockItemCustomization,
  selectAddStockItemPopup,
  setAddStockItemPopupAmount,
  setAddStockItemPopupName,
  setAddStockItemPopupPrice,
} from "../../../redux/slices/stockSlice";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { addStockItem } from "../../../redux/slices/stockSlice";
import CreateStockItemCustomizationPopup from "./CreateStockItemCustomizationPopup";
import { Dropdown } from "primereact/dropdown";

const CreateStockItemPopup = () => {
  const dispatch = useDispatch();

  const addStockItemPopup = useSelector(selectAddStockItemPopup);

  const headerElement = (
    <div className="inline-flex align-items-center justify-content-center gap-2">
      <span className="font-bold white-space-nowrap">Add New Stock Item</span>
    </div>
  );

  const footerContent = (
    <div>
      <Button
        label={addStockItemPopup._id?'Edit':'Create'}
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
        dispatch(closeAddStockItemPopup());
      }}
    >
      <CreateStockItemCustomizationPopup />
      <div className=" card flex justify-content-center align-items-center mt-5 flex-column">
        <FloatLabel className="w-12 w-12 md:w-8 mb-4">
          <label htmlFor="itemname">Item Name</label>
          <InputText
            className="w-12"
            id="itemname"
            value={addStockItemPopup.name}
            onChange={(e) => dispatch(setAddStockItemPopupName(e.target.value))}
          />
        </FloatLabel>
        <FloatLabel className="w-12 w-12 md:w-8 mb-4">
          <label htmlFor="itemprice">Item Price Per Kilo</label>
          <InputText
            className="w-12"
            id="itemprice"
            value={addStockItemPopup.price}
            onChange={(e) =>
              dispatch(setAddStockItemPopupPrice(e.target.value))
            }
            keyfilter="pnum"
          />
        </FloatLabel>
        <FloatLabel className="w-12 w-12 md:w-8 mb-4">
          <label htmlFor="itemamount">Item Amount In Stock</label>
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
      <Button
        label="Add Customization"
        icon="pi pi-plus"
        onClick={() => {
          dispatch(openAddStockItemCustomizationPopup());
        }}
      />
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
                  Show Options For {customization.name}
                </label>
              </FloatLabel>

              <Button
                icon="pi pi-times"
                className="m-1"
                severity="danger"
                aria-label="Cancel"
                onClick={() => {
                  dispatch(removeStockItemCustomization(index));
                }}
              />
              <Button
                icon="pi pi-pencil"
                className="m-1"
                severity="info"
                aria-label="edit"
                onClick={() => {
                  dispatch(openAddStockItemCustomizationPopup(index));
                }}
              />
            </div>
          );
        })}
      </div>
    </Dialog>
  );
};

export default CreateStockItemPopup;
