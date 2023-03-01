import React, { useState } from "react";
import { MapContainer, TileLayer, Polygon } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";

const Map = ({ polygons, selectedPolygon, onPolygonDraw }) => {
  const center = [23.6345, -102.5528]; // Coordenadas de México

  const [drawEnabled, setDrawEnabled] = useState(false);

  const handleDrawStart = () => {
    setDrawEnabled(true);
  };

  const handleDrawStop = () => {
    setDrawEnabled(false);
  };
  

  const handlePolygonDrawn = (e) => {
    const layer = e.layer;
    const polygon = layer.getLatLngs().map((latlng) => [latlng.lat, latlng.lng]);
    onPolygonDraw(polygon);
  };

  return (
    <MapContainer center={center} zoom={6} style={{ height: "100%", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="OpenStreetMap" />
      {polygons.map((polygon) => (
        <Polygon
          key={polygon.id}
          positions={polygon.coordinates}
          color={selectedPolygon?.id === polygon.id ? "red" : "blue"}
        />
      ))}
      {drawEnabled && (
        <EditControl
          position="topright"
          draw={{
            polyline: false,
            marker: false,
            circlemarker: false,
            circle: false,
            rectangle: false,
            polygon: {
              allowIntersection: false,
              showArea: true,
              shapeOptions: {
                color: "blue",
              },
            },
          }}
          onDrawStart={handleDrawStart}
          onDrawStop={handleDrawStop}
          onCreated={handlePolygonDrawn}
        />
      )}
    </MapContainer>
  );
};

export default Map;
