import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";
import Sidebar from "../components/Sidebar/Sidebar";
import L from "leaflet";


const MainPage = () => {
    const [polygons, setPolygons] = useState([]);
    const [selectedPolygon, setSelectedPolygon] = useState(null);
    const center = [23.6345, -102.5528]; // Coordenadas de México
    const mapRef = useRef();
    const [drawControl, setDrawControl] = useState(null);
    const drawnItemsRef = useRef(L.featureGroup());

    const calculatePolygonCentroid = (coordinates) => {
        if (!coordinates || coordinates.length === 0) {
          return [0, 0];
        }
      
        let centroidLat = 0;
        let centroidLng = 0;
        for (let i = 0; i < coordinates.length; i++) {
          centroidLat += coordinates[i][0];
          centroidLng += coordinates[i][1];
        }
        centroidLat /= coordinates.length;
        centroidLng /= coordinates.length;
        return [centroidLat, centroidLng];
      };
      
    
      const calculatePolygonArea = (coordinates) => {
        let area = 0;
        for (let i = 0; i < coordinates.length; i++) {
          const j = (i + 1) % coordinates.length;
          const xi = coordinates[i][0];
          const yi = coordinates[i][1];
          const xj = coordinates[j][0];
          const yj = coordinates[j][1];
          area += xi * yj - yi * xj;
        }
        return Math.abs(area / 2);
      };

    useEffect(() => {
        if (drawControl) {
          const map = mapRef.current.leafletElement;
          const onCreated = (e) => {
            const newPolygon = {
              id: polygons.length + 1,
              name: "New Polygon",
              coordinates: e.layer.getLatLngs()[0].map((coord) => [coord.lat, coord.lng]),
              centroid: [0, 0],
              area: null,
            };
            const updatedPolygons = [...polygons, newPolygon];
            setPolygons(updatedPolygons);
            localStorage.setItem("polygons", JSON.stringify(updatedPolygons));
          };
          drawControl.on("created", onCreated);
          map.addControl(drawControl);
        }
      }, [drawControl, mapRef, polygons]);

    useEffect(() => {
        if (mapRef.current) {
          const map = mapRef.current.leafletElement;
    
          const drawControl = new L.Control.Draw({
            draw: {
              polygon: {
                allowIntersection: false,
                showArea: true,
                shapeOptions: {
                  color: "#00bfff",
                },
              },
              circle: false,
              rectangle: false,
              polyline: false,
              marker: false,
              circlemarker: false,
            },
            edit: {
              featureGroup: drawnItemsRef.current,
            },
          });
    
          map.addControl(drawControl);
          setDrawControl(drawControl);
    
          map.on(L.Draw.Event.CREATED, (event) => {
            const newPolygon = {
              id: polygons.length + 1,
              name: "",
              coordinates: event.layer._latlngs[0].map((coord) => [coord.lat, coord.lng]),
              centroid: [0, 0],
              area: null,
            };
    
            const updatedPolygons = [...polygons, newPolygon];
    
            // Calculamos la información del nuevo polígono
            const centroid = calculatePolygonCentroid(newPolygon.coordinates);
            const area = calculatePolygonArea(newPolygon.coordinates);
            newPolygon.centroid = centroid;
            newPolygon.area = area;
    
            setPolygons(updatedPolygons);
            localStorage.setItem("polygons", JSON.stringify(updatedPolygons));
    
            drawnItemsRef.current.addLayer(event.layer);
          });
        }
      }, []);

      
    

    useEffect(() => {
      const savedPolygons = JSON.parse(localStorage.getItem("polygons"));
      if (savedPolygons) {
        setPolygons(savedPolygons);
      }
    }, []);
  
    const handleSavePolygon = (newPolygonName, newPolygonCoordinates) => {
        const newPolygon = {
          id: polygons.length + 1,
          name: newPolygonName,
          coordinates: newPolygonCoordinates,
          centroid: [0, 0],
          area: null,
        };
      
        const updatedPolygons = [...polygons, newPolygon];
      
        // Calculamos la información del nuevo polígono
        const centroid = calculatePolygonCentroid(newPolygonCoordinates);
        const area = calculatePolygonArea(newPolygonCoordinates);
        newPolygon.centroid = centroid;
        newPolygon.area = area;
      
        setPolygons(updatedPolygons);
        localStorage.setItem("polygons", JSON.stringify(updatedPolygons));
      };
      

  const handleDeletePolygon = (polygon) => {
    const updatedPolygons = polygons.filter((p) => p.id !== polygon.id);
    setPolygons(updatedPolygons);
    localStorage.setItem("polygons", JSON.stringify(updatedPolygons));
  };

  

  const handlePolygonClick = (event, polygon) => {
    const updatedPolygons = polygons.map((p) => {
      if (p.id === polygon.id) {
        const updatedPolygon = { ...polygon };
        updatedPolygon.centroid = calculatePolygonCentroid(updatedPolygon.coordinates);
        updatedPolygon.area = calculatePolygonArea(updatedPolygon.coordinates);
        return updatedPolygon;
      }
      return p;
    });
    setPolygons(updatedPolygons);
    localStorage.setItem("polygons", JSON.stringify(updatedPolygons));
    setSelectedPolygon(polygon);
  };

  

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-8">
          <MapContainer ref={mapRef} center={center} zoom={7} scrollWheelZoom={true} style={{ height: "90vh" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {polygons.map((polygon) => (
              <Polygon key={polygon.id} positions={polygon.coordinates} eventHandlers={{ click: (event) => handlePolygonClick(event, polygon) }} color={selectedPolygon?.id === polygon.id ? "red" : "blue"}/>
            ))}
          </MapContainer>
        </div>
        <div className="col-md-4">
          <Sidebar polygons={polygons} onSavePolygon={handleSavePolygon} onDeletePolygon={handleDeletePolygon} selectedPolygon={selectedPolygon} />
        </div>
    </div>
</div>
);
};

export default MainPage;



