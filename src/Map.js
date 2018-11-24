import React from "react";
import ReactDOMServer from "react-dom/server";
import PropTypes from "prop-types";
import L from "leaflet";
import { Map as LeafletMap, Marker, Polyline, TileLayer } from "react-leaflet";
import Palette from "google-palette";

import { StateContext } from "./StateProvider";

// We need Leaflet's CSS.
import "leaflet/dist/leaflet.css";

// Global CSS overrides.
import "./Map.global.css";

// CSS modules.
import styles from "./Map.module.css";

// From https://github.com/PaulLeCam/react-leaflet/issues/453: required to
// avoid retina display issues.
import MarkerIcon from "leaflet/dist/images/marker-icon.png";
import MarkerRetinaIcon from "leaflet/dist/images/marker-icon-2x.png";
import MarkerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: MarkerRetinaIcon,
  iconUrl: MarkerIcon,
  shadowUrl: MarkerShadow
});

class GroundMarker extends React.PureComponent {
  static propTypes = {
    colour: PropTypes.string.isRequired,
    highlight: PropTypes.bool,
    name: PropTypes.string.isRequired
  };

  render() {
    const { colour, highlight, name } = this.props;
    let classes = [styles.marker];

    if (highlight) {
      classes.push(styles.highlight);
    }

    return (
      <div className={classes.join(" ")}>
        <svg className={styles.svg} viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="50" fill={`#${colour}`} />
        </svg>
        <div className={styles.label} style={{ color: `#${colour}` }}>
          {name}
        </div>
      </div>
    );
  }
}

export default class Map extends React.Component {
  static calculateBounds(grounds) {
    const coords = Object.values(grounds).map(ground => ground.coords);
    const bounds = L.latLngBounds();

    coords.forEach(ll => bounds.extend(ll));

    return bounds;
  }

  render() {
    return (
      <StateContext.Consumer>
        {state => {
          const { grounds } = state.schedule;
          const palette = Palette(
            ["tol", "qualitative"],
            Object.values(grounds).length
          );

          return (
            <LeafletMap
              style={{ height: "100%", width: "100%" }}
              bounds={Map.calculateBounds(grounds)}
              maxZoom={18}
            >
              <TileLayer
                url="http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}{r}.png"
                attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
              />
              {Object.entries(grounds).map(([label, ground]) => {
                const di = L.divIcon({
                  html: ReactDOMServer.renderToStaticMarkup(
                    <GroundMarker
                      colour={palette.pop()}
                      highlight={state.highlightedGround === label}
                      name={label}
                    />
                  )
                });

                return (
                  <Marker icon={di} key={label} position={ground.coords} />
                );
              })}
              {[...state.getEdges()].map((edge, i) => (
                <Polyline
                  key={i}
                  color={`#${edge.colour}`}
                  opacity={
                    state.highlightedEdge === null
                      ? 0.5
                      : state.highlightedEdge[0] === edge.a.match.id &&
                        state.highlightedEdge[1] === edge.b.match.id
                      ? 1.0
                      : 0.2
                  }
                  positions={[edge.a.ground.coords, edge.b.ground.coords]}
                />
              ))}
            </LeafletMap>
          );
        }}
      </StateContext.Consumer>
    );
  }
}
