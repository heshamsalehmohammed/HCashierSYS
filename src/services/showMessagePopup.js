import { toast } from 'react-toastify';
import ReduxDispatchSingleton from './reduxDispatchSingleton';
import {
    openPopup,
    openConfirmationPopup,
    openErrorPopup
} from '../redux/slices/utilitiesSlice';

export default function showMessage(messageConfig) {
    const dispatch = ReduxDispatchSingleton.getDispatch();
    switch (messageConfig.type) {
        case 'openPopup':
        default:
            dispatch(
                openPopup(
                    messageConfig.payload
                )
            );
            break;
        case 'openConfirmationPopup':
            dispatch(
                openConfirmationPopup(
                    messageConfig.payload
                )
            );
            break;
        case 'errorPopup':
            dispatch(
                openErrorPopup(
                    messageConfig.payload
                )
            );
            break;
        case 'toast':
            toast.configure();
            toast[messageConfig.payload.type](messageConfig.payload.content, {
                autoClose: messageConfig.payload.autoClose ?? 2000,
                position:
                    messageConfig.payload.position ?? toast.POSITION.TOP_CENTER
            });
            break;
    }
}
