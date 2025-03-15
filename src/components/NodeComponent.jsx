import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Modal, Form } from 'react-bootstrap';
import '../styles/workflowItem.css';

const NodeComponent = ({ data }) => {
    const defaultJson = `{
   "parameter_1": false, 
   "parameter_2": 100
}`;

    const [showModal, setShowModal] = useState(false);
    const [textInput, setTextInput] = useState(data.parameters || '');

    const handleOpenModal = () => {
        if (!textInput.trim()) {
            setTextInput(defaultJson); // Set default JSON only if input is empty
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        data.parameters = textInput;
        setShowModal(false);
    };

    const handleInputChange = (e) => {
        setTextInput(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault(); // Prevent default tab behavior

            const tabSpaces = "   "; // Insert 3 spaces
            const { selectionStart, selectionEnd } = e.target;
            const newValue =
                textInput.substring(0, selectionStart) + tabSpaces + textInput.substring(selectionEnd);

            setTextInput(newValue);

            // Move cursor forward by 3 spaces
            setTimeout(() => {
                e.target.selectionStart = e.target.selectionEnd = selectionStart + tabSpaces.length;
            }, 0);
        }
    };

    return (
        <>
            <div onDoubleClick={handleOpenModal}>
                {data.label}
                <Handle type="target" position={Position.Top} />
                <Handle type="source" position={Position.Bottom} />
            </div>

            <Modal show={showModal} onHide={handleCloseModal} centered className="custom-modal">
                <Modal.Body onClick={(e) => e.stopPropagation()}>
                    <Form>
                        <Form.Group>
                            <Form.Label className='modal-label'>Input parameters as a JSON Object.</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={textInput}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown} // Enables tab support (3 spaces)
                                className="code-input"
                                spellCheck="false"
                                autoCorrect="off"
                                autoCapitalize="off"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default NodeComponent;
