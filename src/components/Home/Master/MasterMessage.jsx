// components/UserSessions/MasterMessage.js

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';
import { InputTextarea } from 'primereact/inputtextarea';
import { useTranslation } from 'react-i18next';
import {
  sendMessageToSession,
  sendMessageToUserSessions,
  selectMasterMessagePopup,
  closeMasterMessagePopup,
  setMasterMessagePopupType,
  setMasterMessagePopupActionName,
  setMasterMessagePopupActionPayload,
  setMasterMessagePopupToastSeverity,
  setMasterMessagePopupToastSummary,
  setMasterMessagePopupToastMessage,
} from '../../../redux/slices/masterUserSlice';
import { Dropdown } from 'primereact/dropdown';

const parseMessageFromState = (state) => {
    if (state.type === 'action') {
      return JSON.stringify({
        type: 'action',
        reduxActionToBeDispatched: state.action.actionName,
        reduxActionPayloadToBeSent: JSON.parse(state.action.actionPayload),
      });
    } else if (state.type === 'toast') {
      return JSON.stringify({
        type: 'action',
        message: '',
        reduxActionToBeDispatched: 'utilities/showToast',
        reduxActionPayloadToBeSent: {
          message: state.toast.toastMessage,
          severity: state.toast.toastSeverity,
          summary: state.toast.toastSummary,
        },
      });
    } else {
      return '';
    }
  };

const MasterMessage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const masterMessagePopup = useSelector(selectMasterMessagePopup);

  const message = parseMessageFromState(masterMessagePopup);

  const headerElement = (
    <div className="inline-flex align-items-center justify-content-center gap-2">
      <span className="font-bold white-space-nowrap">{t('sendMessage')}</span>
    </div>
  );

  const footerContent = (
    <div>
      <Button
        label={t('send')}
        icon="pi pi-check"
        onClick={() => {
          const { userId, sessionId } = masterMessagePopup.forDetails;
          if (userId) {
            dispatch(sendMessageToUserSessions({ userId, message }));
          } else if (sessionId) {
            dispatch(sendMessageToSession({ sessionId, message }));
          }
          dispatch(closeMasterMessagePopup());
        }}
        autoFocus
      />
    </div>
  );

  const messageTypeOptions = [
    { label: 'Action', value: 'action' },
    { label: 'Toast', value: 'toast' },
  ];

  const toastSeverityOptions = [
    { label: 'Success', value: 'success' },
    { label: 'Error', value: 'error' },
    { label: 'Info', value: 'info' },
    { label: 'Warn', value: 'warn' },
  ];

  return (
    <Dialog
      visible={masterMessagePopup.isShown}
      modal
      header={headerElement}
      footer={footerContent}
      style={{ width: '50rem' }}
      onHide={() => {
        if (!masterMessagePopup.isShown) return;
        dispatch(closeMasterMessagePopup());
      }}
    >
      <div className="card flex justify-content-center align-items-center mt-5 mb-5 flex-column">
        <FloatLabel className="w-10 mb-4">
          <Dropdown
            inputId={`dd-mastermessagetype`}
            options={messageTypeOptions}
            className="w-full"
            value={masterMessagePopup.type}
            onChange={(e) => dispatch(setMasterMessagePopupType(e.value))}
          />
          <label htmlFor={`dd-mastermessagetype`}>{t('type')}</label>
        </FloatLabel>

        {masterMessagePopup.type === 'action' && (
          <>
            <FloatLabel className="w-10 mb-4">
              <InputText
                className="w-12"
                id="actionname"
                value={masterMessagePopup.action.actionName}
                onChange={(e) =>
                  dispatch(setMasterMessagePopupActionName(e.target.value))
                }
              />
              <label htmlFor="actionname">{t('reduxActionName')}</label>
            </FloatLabel>
            <FloatLabel className="w-10 mb-4">
              <InputTextarea
                id="messagereduxactionpayload"
                className="w-12"
                value={masterMessagePopup.action.actionPayload}
                onChange={(e) =>
                  dispatch(setMasterMessagePopupActionPayload(e.target.value))
                }
                rows={5}
                cols={25}
              />
              <label htmlFor="messagereduxactionpayload">
                {t('reduxActionPayload')}
              </label>
            </FloatLabel>
          </>
        )}

        {masterMessagePopup.type === 'toast' && (
          <>
            <FloatLabel className="w-10 mb-4">
              <Dropdown
                inputId={`dd-toastSeverity`}
                options={toastSeverityOptions}
                className="w-full"
                value={masterMessagePopup.toast.toastSeverity}
                onChange={(e) =>
                  dispatch(setMasterMessagePopupToastSeverity(e.value))
                }
              />
              <label htmlFor={`dd-toastSeverity`}>{t('toastSeverity')}</label>
            </FloatLabel>

            <FloatLabel className="w-10 mb-4">
              <InputText
                inputId={`dd-toastSummary`}
                className="w-full"
                value={masterMessagePopup.toast.toastSummary}
                onChange={(e) =>
                  dispatch(setMasterMessagePopupToastSummary(e.target.value))
                }
              />
              <label htmlFor={`dd-toastSummary`}>{t('toastSummary')}</label>
            </FloatLabel>

            <FloatLabel className="w-10 mb-4">
              <InputTextarea
                id="messagereduxmessage"
                className="w-12"
                value={masterMessagePopup.toast.toastMessage}
                onChange={(e) =>
                  dispatch(setMasterMessagePopupToastMessage(e.target.value))
                }
                rows={5}
                cols={25}

/>
              <label htmlFor="messagereduxmessage">{t('toastMessage')}</label>
            </FloatLabel>
          </>
        )}
      </div>
    </Dialog>
  );
};

export default MasterMessage;
