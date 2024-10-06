import React, { useRef, useEffect } from 'react';
import { Toast } from 'primereact/toast';
import { useSelector, useDispatch } from 'react-redux';
import { useAppendToContainer } from '../../../hooks/useAppendToContainer';
import { clearToastMessage } from '../../../redux/slices/utilitiesSlice';

export default function AppToastContainer() {
    const toast = useRef(null);
    const dispatch = useDispatch();

    // Retrieve toast message from Redux store
    const { toastMessage, toastSeverity, toastSummary } = useSelector(
      (state) => state.utilities.toast
    );

    useEffect(() => {
        if (toastMessage) {
            toast.current.show({ severity: toastSeverity, summary: toastSummary, detail: toastMessage });

            // Clear the message after showing
            dispatch(clearToastMessage());
        }
    }, [toastMessage, toastSeverity, toastSummary, dispatch]);
    const container = useAppendToContainer();
    return <Toast ref={toast} appendTo={container}/>;
}