import React from "react";
import { Button } from "react-bootstrap";

const NewFieldButton = ({ onClick }) => {
  return (
    <Button variant="primary" onClick={onClick}>
      New Field
    </Button>
  );
};

export default NewFieldButton;