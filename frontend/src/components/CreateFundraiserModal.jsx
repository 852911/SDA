import React, { useState } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";

function CreateFundraiserModal({ show, onClose, onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!title || !description || !goal) {
    setError("All fields are required!");
    return;
  }

  setError("");
  setLoading(true);

  try {
    const response = await fetch("http://localhost:5000/api/fundsraisers/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ title, description, goal: Number(goal) }),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Failed to create fundraiser");

    // Notify parent component that a new fundraiser is created
    onCreated({
      id: data.fundraiserId,       // matches your backend response
      title,
      description,
      goal: Number(goal),
      raised: 0,
      status: "Pending Approval",
    });

    // Show success alert
    alert("Your request has been sent to the admin.");

    // Reset form
    setTitle("");
    setDescription("");
    setGoal("");
    onClose(); // optionally close the modal
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create Fundraiser</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Fundraiser title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Fundraiser description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Goal Amount ($)</Form.Label>
            <Form.Control
              type="number"
              placeholder="e.g. 5000"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
          </Form.Group>

          <Button type="submit" className="w-100" variant="success" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Create Fundraiser"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default CreateFundraiserModal;
