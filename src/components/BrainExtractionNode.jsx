import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Draggable from 'react-draggable';
import '../styles/workflowItem.css';

const BrainExtractionNode = ({ id, position, updateNodeData }) => {
    const [parameters, setParameters] = useState({
        threshold: 0.5,
        mask: true
    });

    const [showModal, setShowModal] = useState(false);
    const [hover, setHover] = useState(false);

    // Load saved parameters from localStorage on mount
    useEffect(() => {
        const savedParams = localStorage.getItem(`brainExtraction-${id}`);
        if (savedParams) {
            setParameters(JSON.parse(savedParams));
        }
    }, [id]);

    // Save parameters to localStorage on change
    useEffect(() => {
        localStorage.setItem(`brainExtraction-${id}`, JSON.stringify(parameters));
    }, [parameters, id]);

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setParameters((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : parseFloat(value)
        }));
    };

    return (
        <Draggable bounds="parent" defaultPosition={position}>
            <div
                className="workflow-item"
                style={{ position: 'absolute', top: position.y, left: position.x }}
                onClick={handleOpenModal}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
                <p className='text'>Brain Extraction</p>

                {/* Hover Tooltip */}
                {hover && (
                    <div className="tooltip-box">
                        <p>Threshold: {parameters.threshold}</p>
                        <p>Mask: {parameters.mask ? "Yes" : "No"}</p>
                    </div>
                )}

                {/* Modal for Parameter Editing */}
                <Modal show={showModal} onHide={handleCloseModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Brain Extraction Parameters</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            {/* Threshold Input */}
                            <Form.Group className="mb-3">
                                <Form.Label>Threshold</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="threshold"
                                    value={parameters.threshold}
                                    step="0.1"
                                    min="0"
                                    max="1"
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            {/* Mask Checkbox */}
                            <Form.Group className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    label="Apply Mask"
                                    name="mask"
                                    checked={parameters.mask}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </Draggable>
    );
};

export default BrainExtractionNode;
