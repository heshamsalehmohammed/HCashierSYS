import React from 'react';
import { useDispatch } from 'react-redux';
import { Dialog } from 'primereact/dialog';
import { closePopup } from '../../../redux/slices/utilitiesSlice';
//import waringnIcon from '../../../../assets/images/warning-icon.png';
import { Button } from 'primereact/button';


const PopupMessage = ({
    type,
    title,
    message,
    multiMessages = false,
    headers = [],
    buttonLabel = 'Ok'
}) => {
    const dispatch = useDispatch();

    const handlePopupClose = () => {
        dispatch(closePopup());
    };

    const headerTemplate = () => {
        return (
            <>
                {type === 'Error' ? (
                    // <i
                    //     className='fa fa-warning text-danger'
                    //     style={{
                    //         fontSize: '1.5em',
                    //         marginRight: '8px'
                    //     }}
                    // />
                    <img
                        //src={waringnIcon}
                        style={{
                            width: '15px',
                            margin: '3px 10px 0 0',
                            float: 'left'
                        }}
                    />
                ) : (
                    ''
                )}
                {title}
            </>
        );
    };

    const dialogContentStyle = multiMessages
        ? {
              maxHeight: '250px',
              minHeight: '90px',
              overflowY: 'scroll',
              border: '1px solid #80808047',
              borderRadius: '7px'
          }
        : {};

    return (
        <Dialog
            header={headerTemplate()}
            visible
            style={{ width: '35vw' }}
            modal
            onHide={handlePopupClose}
        >
            {headers && headers.length > 0 && (
                <div className='dialog-headers'>
                    {headers.map((m) => (
                        <h6
                            style={{
                                marginTop: '8px',
                                marginBottom: '8px',
                                marginLeft: '15px',
                                cursor: 'text',
                                userSelect: 'text'
                            }}
                        >
                            {m}
                        </h6>
                    ))}
                </div>
            )}
            <div className='dialog-content'>
                {multiMessages ? (
                    message.map((m) => (
                        <h6
                            style={{
                                marginTop: '8px',
                                marginBottom: '8px',
                                marginLeft: '15px',
                                cursor: 'text',
                                userSelect: 'text'
                            }}
                        >
                            {m}
                        </h6>
                    ))
                ) : (
                    <h6
                        style={{
                            marginTop: '8px',
                            marginBottom: '8px'
                        }}
                    >
                        {message}
                    </h6>
                )}
            </div>
            <div className='dialog-footer'>
                <Button
                    className=''
                    style={{
                        marginTop: '16px'
                        // className: {type === 'Error'}? ' ' : ''
                    }}
                    onClick={handlePopupClose}
                >
                    {buttonLabel}
                </Button>
            </div>
        </Dialog>
    );
};

export default PopupMessage;
