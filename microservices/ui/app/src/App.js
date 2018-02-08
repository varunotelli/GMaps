import React, { Component } from "react";
import GForm from './components/GForm';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";


export const MapWithAMarker = withScriptjs(withGoogleMap(props =>
  <GoogleMap
    defaultZoom={5}
    defaultCenter={{ lat: 21.9937, lng: 78.9629 }}
  >

  </GoogleMap>
));

class App extends Component {
 
  render() {
    return (
      <div className="App">
        <GForm  />
        <MapWithAMarker isMarkerShown
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `700px` }} />}
          mapElement={<div className="container-fluid" id="mapElement" style={{ height: `100%` }} />}
        />
      </div>
    );
  }
}

export default App;
