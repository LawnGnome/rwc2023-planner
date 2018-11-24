import React from "react";
import PropTypes from "prop-types";
import L from "leaflet";
import "leaflet-polylinedecorator";
import { Path, withLeaflet } from "react-leaflet";

class PolylineDecorator extends Path {
  static propTypes = {
    leaflet: PropTypes.object.isRequired,
    patterns: PropTypes.array.isRequired,
    positions: PropTypes.array.isRequired
  };

  createLeafletElement(props) {
    const { patterns, positions } = this.props;
    const polyline = L.polyline(positions, this.getPathOptions(props));

    return L.polylineDecorator(polyline, { patterns: patterns });
  }

  updateLeafletElement(fromProps, toProps) {
    if (fromProps.positions !== toProps.positions) {
      this.leafletElement.setPaths(toProps.positions);
    }

    if (fromProps.patterns !== toProps.patterns) {
      this.leafletElement.setPatterns(toProps.patterns);
    }

    this.setStyleIfChanged(fromProps, toProps);
  }
}

export default withLeaflet(PolylineDecorator);
