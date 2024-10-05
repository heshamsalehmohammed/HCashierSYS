import { useDispatch, useSelector } from "react-redux";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import {
  addStockItemCustomization,
  addStockItemCustomizationName,
  addStockItemCustomizationOption,
  closeAddStockItemCustomizationPopup,
  removeStockItemCustomizationOption,
  selectAddStockItemCustomizationPopup,
  selectAddStockItemPopup,
  setStockItemCustomizationOptionAdditionalPrice,
  setStockItemCustomizationOptionName,
} from "../../../redux/slices/stockSlice";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { useTranslation } from "react-i18next";

const CreateStockItemCustomizationPopup = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const addStockItemPopup = useSelector(selectAddStockItemPopup);
  const addStockItemCustomizationPopup = useSelector(
    selectAddStockItemCustomizationPopup
  );

  const headerElement = (
    <div className="inline-flex align-items-center justify-content-center gap-2">
      <span className="font-bold white-space-nowrap">
        {t("addNewCustomizationFor")} {addStockItemPopup.name}
      </span>
    </div>
  );

  const footerContent = (
    <div>
      <Button
        label={
          addStockItemCustomizationPopup._id
            ? t("editCustomization")
            : t("addCustomization")
        }
        icon="pi pi-check"
        onClick={() => {
          dispatch(addStockItemCustomization());
        }}
        autoFocus
      />
    </div>
  );

  return (
    <Dialog
      visible={addStockItemCustomizationPopup.isShown}
      modal
      header={headerElement}
      footer={footerContent}
      style={{ width: "50rem" }}
      onHide={() => {
        if (!addStockItemCustomizationPopup.isShown) return;
        dispatch(closeAddStockItemCustomizationPopup());
      }}
    >
      <div className=" card flex justify-content-center align-items-center mt-4 flex-column">
        <FloatLabel className="w-12 w-12 md:w-8 mb-4">
          <label htmlFor="customizationname">{t("customizationName")}</label>
          <InputText
            className="w-12"
            id="customizationname"
            value={addStockItemCustomizationPopup.name}
            onChange={(e) =>
              dispatch(addStockItemCustomizationName(e.target.value))
            }
          />
        </FloatLabel>
      </div>
      <Button
        label={t("addOption")}
        icon="pi pi-plus"
        onClick={() => {
          dispatch(addStockItemCustomizationOption());
        }}
      />
      {addStockItemCustomizationPopup.options.map((option, index) => {
        return (
          <div
            key={`stockItemCustomizationOption-${index}`}
            className="pt-4 flex align-items-center justify-content-center"
          >
            <FloatLabel className="w-4 m-1">
              <label htmlFor={`stockItemCustomizationOptionName-${index}`}>
                {t("optionName")}
              </label>
              <InputText
                className="w-12"
                id={`stockItemCustomizationOptionName-${index}`}
                value={option.name}
                onChange={(e) =>
                  dispatch(
                    setStockItemCustomizationOptionName({
                      value: e.target.value,
                      index,
                    })
                  )
                }
              />
            </FloatLabel>
            <FloatLabel className="w-4 m-1">
              <label
                htmlFor={`stockItemCustomizationOptionAdditionalPrice-${index}`}
              >
                {t("optionAdditionalPrice")}
              </label>
              <InputText
                className="w-12"
                id={`stockItemCustomizationOptionAdditionalPrice-${index}`}
                value={option.additionalPrice}
                onChange={(e) =>
                  dispatch(
                    setStockItemCustomizationOptionAdditionalPrice({
                      value: e.target.value,
                      index,
                    })
                  )
                }
                keyfilter="pnum"
              />
            </FloatLabel>
            <Button
              icon="pi pi-times"
              severity="danger"
              aria-label={t("cancel")}
              onClick={() => {
                dispatch(removeStockItemCustomizationOption(index));
              }}
            />
          </div>
        );
      })}
    </Dialog>
  );
};

export default CreateStockItemCustomizationPopup;
