import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button, Spinner, Badge, Container } from "react-bootstrap";
import { CurrencyDollar, PlusCircle } from "react-bootstrap-icons";
import CreateFundraiserModal from "../components/CreateFundraiserModal";

function FundraiserCard({ title, description, goalAmount, collectedAmount, status }) {
  const progress = Math.min((collectedAmount / goalAmount) * 100, 100);

  // Disable button if status is completed or closed
  const isDisabled = status === "completed" || status === "closed";

  return (
    <Card className="shadow-sm mb-4 border-0 rounded-4">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <Card.Title className="fw-bold">{title}</Card.Title>
            <Badge bg={status === "ongoing" ? "success" : "secondary"}>{status}</Badge>
          </div>
          <CurrencyDollar size={28} className="text-primary" />
        </div>
        <Card.Text className="mt-2 text-muted">{description}</Card.Text>
        <div className="mt-3">
          <div className="d-flex justify-content-between mb-1">
            <span>Raised: ${collectedAmount}</span>
            <span>Goal: ${goalAmount}</span>
          </div>
          <div className="progress rounded-pill" style={{ height: "10px" }}>
            <div
              className="progress-bar bg-primary"
              role="progressbar"
              style={{ width: `${progress}%` }}
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        </div>
        <Button className="mt-3 w-100" variant="primary" disabled={isDisabled}>
          Donate Now
        </Button>
      </Card.Body>
    </Card>
  );
}

// Fundraiser Page
function FundRaiser() {
  const [fundraisers, setFundraisers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchFundraisers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token"); // JWT token
      const res = await fetch("http://localhost:5000/api/fundsraisers/get-approved-fundraisers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch fundraisers");

      setFundraisers(
        data.data.map((f) => ({
          id: f._id,
          title: f.title,
          description: f.discription,
          goalAmount: f.goalAmount,
          collectedAmount: f.collectedAmount,
          status: f.status,
        }))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFundraisers();
  }, []);

  const handleFundraiserCreated = (newFundraiser) => {
  if (newFundraiser.isApproved === "yes") {
    setFundraisers((prev) => [newFundraiser, ...prev]);
  }
  setShowModal(false);
};


  return (
    <Container className="py-4" style={{ marginTop: "56px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">Fundraisers</h2>
        <Button variant="success" onClick={() => setShowModal(true)}>
          <PlusCircle className="me-2" /> Create Fundraiser
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" />
        </div>
      ) : (
        <Row>
          {fundraisers.map((fundraiser) => (
            <Col md={6} lg={4} key={fundraiser.id}>
              <FundraiserCard {...fundraiser} />
            </Col>
          ))}
        </Row>
      )}

      <CreateFundraiserModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onCreated={handleFundraiserCreated}
      />
    </Container>
  );
}

export default FundRaiser;
