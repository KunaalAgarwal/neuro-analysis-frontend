import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import '../styles/headerBar.css';

function HeaderBar(){
    const [showInfo, setShowInfo] = useState(false);

    const handleShowInfo = () => setShowInfo(true);
    const handleCloseInfo = () => setShowInfo(false);

    return (
        <div className="header-bar">
            <h1>Neuroimaging Workflow Generator</h1>
            <span className="info-icon" onClick={handleShowInfo}>ℹ️</span>
            <Modal className="custom-modal" show={showInfo} onHide={handleCloseInfo} centered>
                <Modal.Body className="modal-label">
                    Double click nodes to edit parameters; click then press Backspace to remove nodes or edges.
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default HeaderBar;
