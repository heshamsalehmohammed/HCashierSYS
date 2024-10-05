import { useDispatch, useSelector } from "react-redux";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import {
  closeAddCustomerPopup,
  editCustomer,
  handleNewOrderForCustomerButtonClick,
  selectAddCustomerPopup,
  setAddCustomerPopupAddress,
  setAddCustomerPopupName,
  setAddCustomerPopupPhone,
} from "../../../redux/slices/customersSlice";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { InputTextarea } from "primereact/inputtextarea";
import { addCustomer } from "../../../redux/slices/customersSlice";
import _ from "lodash";
import { useTranslation } from "react-i18next";

const CreateCustomerPopup = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const addCustomerPopup = useSelector(selectAddCustomerPopup);

  const headerElement = (
    <div className="inline-flex align-items-center justify-content-center gap-2">
      <span className="font-bold white-space-nowrap">
        {addCustomerPopup._id ? t("edit") : t("addNew")} {t("customer")}
      </span>
    </div>
  );

  const footerContent = (
    <div>
      <Button
        label={addCustomerPopup._id ? t("edit") : t("create")}
        icon="pi pi-check"
        onClick={() => {
          if (addCustomerPopup._id) {
            dispatch(editCustomer());
          } else {
            dispatch(addCustomer());
          }
        }}
        autoFocus
      />
      {addCustomerPopup._id && (
        <Button
          icon="pi pi-plus"
          label={t("newOrder")}
          className=" p-button-success mr-2"
          onClick={() => {
            const customer = _.cloneDeep(addCustomerPopup);
            delete customer.isShown;
            dispatch(
              handleNewOrderForCustomerButtonClick({
                customer
              })
            );
          }}
          tooltip={t("newOrder")}
        />
      )}
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
        dispatch(closeAddCustomerPopup());
      }}
    >
      <div className=" card flex justify-content-center align-items-center mt-5 mb-5 flex-column">
        <FloatLabel className="w-12 w-12 md:w-8 mb-4">
          <label htmlFor="customername">{t("customerName")}</label>
          <InputText
            className="w-12"
            id="customername"
            value={addCustomerPopup.name}
            onChange={(e) => dispatch(setAddCustomerPopupName(e.target.value))}
          />
        </FloatLabel>

        <FloatLabel className="  w-12 w-12 md:w-8 mb-4">
          <label htmlFor="phone">{t("phone")}</label>
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
            onChange={(e) =>
              dispatch(setAddCustomerPopupAddress(e.target.value))
            }
            rows={5}
            cols={25}
          />
          <label htmlFor="Address">{t("address")}</label>
        </FloatLabel>
      </div>
    </Dialog>
  );
};

export default CreateCustomerPopup;
