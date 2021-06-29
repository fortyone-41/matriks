import React from 'react';

const Modal = ({
    visible = false,
    setModal,
    actualData,
    setActualData
}) => {

    const onClose = () => {setModal(false); setActualData(null)}
    if (!visible) return null;

    return <div className="modal" onClick={onClose}>
        <div className="modal-dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
                <h3 className="modal-title"></h3>
                <span className="modal-close" onClick={onClose}>
                    &times;
                </span>
            </div>
            <div className="modal-body">
                <div className="modal-content"></div>
            </div>
            <div className="modal-footer"></div>
        </div>
    </div>
}

export default Modal;