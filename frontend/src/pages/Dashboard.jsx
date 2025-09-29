import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button, Spinner, Container } from "react-bootstrap";
import { PeopleFill, HeartFill, Search, BookFill, BoxFill } from "react-bootstrap-icons";

// Reusable Stat Card Component
function StatCard({ icon, title, value, loading, color, suffix }) {
  return (
    <Card className="shadow-sm border-0 rounded-3">
      <Card.Body className="d-flex align-items-center">
        <div className={`bg-${color} text-white p-3 rounded-circle me-3`}>
          {icon}
        </div>
        <div>
          <Card.Title className="mb-0">{title}</Card.Title>
          <div className="text-muted">
            {loading ? <Spinner animation="border" size="sm" /> : `${value} ${suffix}`}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

// Reusable Quick Link Card Component
function QuickLinkCard({ icon, text, color, buttonText }) {
  return (
    <Card className="shadow-sm border-0 text-center p-3 hover-card" style={{ cursor: "pointer" }}>
      <div className={`text-${color} mb-2`}>{icon}</div>
      <Card.Text>{text}</Card.Text>
      <Button size="sm" variant={`outline-${color}`}>
        {buttonText}
      </Button>
    </Card>
  );
}

function Dashboard() {
  const [studentCount, setStudentCount] = useState(0);
  const [fundraiserCount, setFundraiserCount] = useState(0);
  const [lostFoundCount, setLostFoundCount] = useState(0);
  const [studyGroupCount, setStudyGroupCount] = useState(0);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingFundraisers, setLoadingFundraisers] = useState(true);
  const [loadingLostFound, setLoadingLostFound] = useState(true);
  const [loadingGroups, setLoadingGroups] = useState(true);

  useEffect(() => {
    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

    const fetchCount = async (url, setter, loaderSetter) => {
      try {
        const res = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        setter(data?.data?.totalStudents ?? data?.data?.totalApprovedFundraisers ?? data?.data?.totalLostAndFound ?? data?.data?.totalGroups ?? 0);
      } catch (err) {
        console.error("Error fetching count:", err);
      } finally {
        loaderSetter(false);
      }
    };

    fetchCount(`${API_URL}/api/students/no-of-students`, setStudentCount, setLoadingStudents);
    fetchCount('http://localhost:5000/api/fundsraisers/no-of-approved-fund-raisers', setFundraiserCount, setLoadingFundraisers);
    fetchCount(`${API_URL}/api/lost-and-found/no-of-lost-and-found`, setLostFoundCount, setLoadingLostFound);
    fetchCount(`${API_URL}/api/study-groups/no-of-groups`, setStudyGroupCount, setLoadingGroups);
  }, []);

  return (
    <Container fluid className="pt-4" >
      <h2 className="fw-bold mb-4 text-primary">Dashboard</h2>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <StatCard
            icon={<PeopleFill size={28} />}
            title="Community Members"
            value={studentCount}
            loading={loadingStudents}
            color="primary"
            suffix="Active"
          />
        </Col>

        <Col md={3}>
          <StatCard
            icon={<HeartFill size={28} />}
            title="Fundraisers"
            value={fundraiserCount}
            loading={loadingFundraisers}
            color="danger"
            suffix="Ongoing"
          />
        </Col>

        <Col md={3}>
          <StatCard
            icon={<Search size={28} />}
            title="Lost & Found"
            value={lostFoundCount}
            loading={loadingLostFound}
            color="warning"
            suffix="Reports"
          />
        </Col>

        <Col md={3}>
          <StatCard
            icon={<BookFill size={28} />}
            title="Study Groups"
            value={studyGroupCount}
            loading={loadingGroups}
            color="success"
            suffix="Active"
          />
        </Col>
      </Row>

      {/* Quick Links Section */}
      <h4 className="fw-semibold mb-3">Quick Links</h4>
      <Row className="g-3">
        <Col md={3}>
          <QuickLinkCard icon={<BookFill size={32} />} text="Study Groups" color="primary" buttonText="Explore" />
        </Col>
        <Col md={3}>
          <QuickLinkCard icon={<BoxFill size={32} />} text="Resources" color="success" buttonText="Open" />
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
