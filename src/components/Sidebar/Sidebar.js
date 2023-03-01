import React, { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";

const Sidebar = ({ polygons, setSelectedPolygon, onSavePolygon, onDeletePolygon }) => {
  const [newPolygonName, setNewPolygonName] = useState("");
  const [isEditingPolygon, setIsEditingPolygon] = useState(false);

  const handleSearch = (event) => {
    const { value } = event.target;
    const polygon = polygons.find((p) => p.name === value);
    setSelectedPolygon(polygon);
  };

  const handleNewPolygon = () => {
    setIsEditingPolygon(true);
  };

  const handleSavePolygon = () => {
    onSavePolygon(newPolygonName);
    setIsEditingPolygon(false);
    setNewPolygonName("");
  };

  const handleCancelPolygon = () => {
    setIsEditingPolygon(false);
    setNewPolygonName("");
  };

  const handleNewPolygonNameChange = (event) => {
    setNewPolygonName(event.target.value);
  };

  const isValidNewPolygonName = newPolygonName.trim().length > 0;

  const handleDeletePolygon = (event, polygon) => {
    event.stopPropagation();
    onDeletePolygon(polygon);
  };

  return (
    <Card>
      <Card.Header>
        <Form.Control type="text" placeholder="Search by name" onChange={handleSearch} />
      </Card.Header>

      <Card.Body>
        <Button variant="primary" onClick={handleNewPolygon}>
          New Field
        </Button>
        {isEditingPolygon && (
          <>
            <Form.Control type="text" placeholder="Enter polygon name" value={newPolygonName} onChange={handleNewPolygonNameChange} />
            <Button variant="primary" onClick={handleSavePolygon} disabled={!isValidNewPolygonName}>
              Guardar
            </Button>
            <Button variant="secondary" onClick={handleCancelPolygon}>
              Cancelar
            </Button>
          </>
        )}
        {polygons.map((polygon) => (
          <Card key={polygon.id} onClick={() => setSelectedPolygon(polygon)}>
            <Card.Body>
              <Card.Title>{polygon.name}</Card.Title>
              <Card.Text>{polygon.area ? `Area: ${polygon.area.toFixed(2)} hectares` : "Area not available"}</Card.Text>
              <Button variant="danger" onClick={(event) => handleDeletePolygon(event, polygon)}>Borrar</Button>
            </Card.Body>
          </Card>
        ))}
      </Card.Body>
    </Card>
  );
};

export default Sidebar;