import { useDispatch, useSelector } from "react-redux";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import {
  closeAddCustomerPopupAddress,
  selectAddCustomerPopup,
  setAddCustomerPopupAddress,
  setAddCustomerPopupName,
  setAddCustomerPopupPhone,
} from "../../../redux/slices/customersSlice";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { InputTextarea } from "primereact/inputtextarea";
import { addCustomer } from "../../../redux/slices/customersSlice";


const CreateCustomerPopup = () => {
  const dispatch = useDispatch();

  const addCustomerPopup = useSelector(selectAddCustomerPopup);

  const headerElement = (
    <div className="inline-flex align-items-center justify-content-center gap-2">
      <span className="font-bold white-space-nowrap">Add New Customer</span>
    </div>
  );

  const footerContent = (
    <div>
      <Button
        label="Create"
        icon="pi pi-check"
        onClick={() => {
          dispatch(closeAddCustomerPopupAddress())
          dispatch(addCustomer())
        }}
        autoFocus
      />
    </div>
  );

  return (
    <Dialog
      visible={addCustomerPopup.isShown}
      modal
      header={headerElement}
      footer={footerContent}
      style={{ width: "50rem" }}
      onHide={() => {
        if (!addCustomerPopup.isShown) return;
        dispatch(closeAddCustomerPopupAddress());
      }}
    >
      <div className=" card flex justify-content-center align-items-center mt-5 mb-5 flex-column">
        <FloatLabel className="w-12 w-12 md:w-8 mb-4">
          <label htmlFor="customername">Customername</label>
          <InputText
            className="w-12"
            id="customername"
            value={addCustomerPopup.name}
            onChange={(e) => dispatch(setAddCustomerPopupName(e.target.value))}
          />
        </FloatLabel>

        <FloatLabel className="  w-12 w-12 md:w-8 mb-4">
          <label htmlFor="phone">Phone</label>
          <InputText
            className="w-12"
            id="phone"
            value={addCustomerPopup.phone}
            onChange={(e) => dispatch(setAddCustomerPopupPhone(e.target.value))}
          />
        </FloatLabel>

        <FloatLabel className="w-12 md:w-8">
          <InputTextarea
            id="Address"
            className="w-12"
            value={addCustomerPopup.address}
            onChange={(e) => dispatch(setAddCustomerPopupAddress(e.target.value))}
            rows={5}
            cols={25}
          />
          <label htmlFor="Address">Address</label>
        </FloatLabel>
      </div>
    </Dialog>
  );
};

export default CreateCustomerPopup;
