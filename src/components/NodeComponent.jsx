import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Modal, Form } from 'react-bootstrap';
import '../styles/workflowItem.css';

const NodeComponent = ({ data }) => {
    const defaultJson = `{
    "ex_parameter_1": false, 
    "ex_parameter_2": 100,
    "ex_parameter_3": "multi-layer"
}`;

    const [showModal, setShowModal] = useState(false);
    const [textInput, setTextInput] = useState(data.parameters || '');

    const handleOpenModal = () => {
        let inputValue = textInput;

        // Ensure inputValue is always a string before calling trim()
        if (typeof inputValue !== 'string') {
            inputValue = JSON.stringify(inputValue, null, 2); // Convert object to formatted JSON string
        }

        if (!inputValue.trim()) {
            setTextInput(defaultJson);
        } else {
            setTextInput(inputValue);
        }

        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);

        // Attempt to parse; fallback to user’s raw text if invalid
        if (typeof data.onSaveParameters === 'function') {
            try {
                data.onSaveParameters(JSON.parse(textInput));
            } catch (err) {
                alert('Invalid JSON entered. Defaulting to raw text storage. Please ensure entry is formatted appropriately.');
                data.onSaveParameters(textInput);
            }
        }
    };

    const handleInputChange = (e) => {
        setTextInput(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const tabSpaces = '   '; // Insert 3 spaces
            const { selectionStart, selectionEnd } = e.target;
            const newValue =
                textInput.substring(0, selectionStart) +
                tabSpaces +
                textInput.substring(selectionEnd);

            setTextInput(newValue);

            // Move cursor forward by 3 spaces
            setTimeout(() => {
                e.target.selectionStart = e.target.selectionEnd =
                    selectionStart + tabSpaces.length;
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

            <Modal
                show={showModal}
                onHide={handleCloseModal}
                centered
                className="custom-modal"
            >
                <Modal.Body onClick={(e) => e.stopPropagation()}>
                    <Form>
                        <Form.Group>
                            <Form.Label className="modal-label">
                                Input parameters as a JSON Object.
                                For NO parameterization input an empty object.
                            </Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                value={textInput}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
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
