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
                <Modal.Body className="modal-label header-modal">
                    <ul style={{ paddingLeft: '20px', marginBottom: '0', lineHeight: '2.0' }}>
                        <li><strong>Drag and Drop:</strong> Move nodes from the left-side menu into the canvas.</li>
                        <li><strong>Edit Parameters:</strong> Double-click a node to modify its parameters. Click outside the popup to exit.</li>
                        <li><strong>Connect Nodes:</strong> Draw connections between nodes within the canvas to define the workflow structure.</li>
                        <li><strong>Delete Elements:</strong> Click a node or edge and press Backspace to remove it.</li>
                        <li><strong>Manage Workspaces:</strong> Organize workflows using multiple workspaces, which are saved using persistent in-browser databases.</li>
                        <li><strong>Generate Workflow:</strong> Produce a workflow zip file containing the CWL workflow and the CWL Tool dependencies.</li>
                    </ul>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default HeaderBar;
