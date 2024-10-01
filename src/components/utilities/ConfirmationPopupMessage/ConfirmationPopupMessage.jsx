// @ts-nocheck
import React from 'react';
import { useDispatch } from 'react-redux';
import { Dialog } from 'primereact/dialog';
import { closeConfirmationPopup } from '../../../redux/slices/utilitiesSlice';
import { isNullOrWhiteSpace } from '../../../services/generalHelpers';
import './ConfirmationPopupMessage.scss';


const ConfirmationPopupMessage = ({
    actionName,
    actionMessage = '',
    confirmCallback,
    showConfirmationButton = true,
    cancelCallback,
    confirmationButtonText,
    cancelText = 'No',
    closable = true,
    confirmationButtonProps = {}
}) => {
    const dispatch = useDispatch();

    const handlePopupClose = () => {
        if (cancelCallback) cancelCallback();
        dispatch(closeConfirmationPopup());
    };

    const yesClicked = () => {
        confirmCallback();
    };

    const message = isNullOrWhiteSpace(actionMessage)
        ? `Are you sure you want to ${actionName}?`
        : actionMessage;

    return (
        <Dialog
            visible
            style={{
                width: '35vw'
            }}
            modal
            onHide={handlePopupClose}
            header={actionName}
            closable={closable}
            draggable={false}
            className='confirmation-popup'
        >
            <div className='dialog-content' style={{ minHeight: '90px' }}>
                <h6
                    style={{
                        marginTop: '8px',
                        marginBottom: '8px'
                    }}
                >
                    {message}
                </h6>
            </div>
            <div className='dialog-footer'>
                {showConfirmationButton ? (
                    <>
                        <button
                            className='btn btn-primary float-right'
                            style={{ marginTop: '16px' }}
                            onClick={yesClicked}
                            {...confirmationButtonProps}
                        >
                            {confirmationButtonText || 'Yes'}
                        </button>
                        {cancelText !== 'NoButton' && (
                            <button
                                className='btn btn-secondary float-right mr-2'
                                style={{ marginTop: '16px' }}
                                onClick={handlePopupClose}
                            >
                                {cancelText}
                            </button>
                        )}
                    </>
                ) : null}
            </div>
            <div className='clearfix'></div>
        </Dialog>
    );
};

export default ConfirmationPopupMessage;
