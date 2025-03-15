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
            {/*ℹ️ */}
            <span className="header-span" onClick={handleShowInfo}>[how-to]</span>
            <a className="header-span header-link" href="https://github.com/KunaalAgarwal/neuro-analysis-frontend" target="_blank">[github]</a>
            <a className="header-span header-link" href="https://github.com/KunaalAgarwal/neuro-analysis-frontend/issues" target="_blank">[issues]</a>
            <Modal className="custom-modal" show={showInfo} onHide={handleCloseInfo} centered>
                <Modal.Body className="modal-label">
                    To build a workflow drag and drop nodes from the left-side menu into the canvas.
                    Double click nodes to edit parameters and draw connections between nodes to prepare your custom workflow.
                    To delete Click + Backspace. You can also keep your workflows organized using multiple workspaces, all of which
                    are persistent using in-browser databases.
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default HeaderBar;
