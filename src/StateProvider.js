import React from "react";
import Palette from "google-palette";
import humaniseDistance from "humanize-distance";
import moment from "moment";

// Required for humanize-distance to be able to render the distance.
import "intl/locale-data/jsonp/en-US.js";

import Schedule from "./Schedule";

function matchIDsFromLocation(hash) {
  try {
    return JSON.parse(hash.replace(/^#/, ""));
  } catch (e) {
    return [];
  }
}

const DEFAULT_STATE = {
  highlightedEdge: null,
  highlightedGround: null,
  matches: matchIDsFromLocation(window.location.hash),
  schedule: Schedule
};

export const StateContext = React.createContext(DEFAULT_STATE);

class EdgeSet {
  constructor(schedule, paletteSize) {
    this.map = new Map();
    this.palette = Palette(
      ["mpn65", "qualitative"],
      paletteSize || schedule.matches.length
    );
    this.schedule = schedule;
  }

  [Symbol.iterator]() {
    return this.map.values();
  }

  static id(a, b) {
    return `${a.id}--${b.id}`;
  }

  add(a, b) {
    const ga = this.schedule.grounds[a.ground];
    const gb = this.schedule.grounds[b.ground];

    this.map.set(EdgeSet.id(a, b), {
      a: { ground: ga, match: a },
      b: { ground: gb, match: b },
      colour: this.palette.pop(),
      distance: humaniseDistance(
        { latitude: ga.coords[0], longitude: ga.coords[1] },
        { latitude: gb.coords[0], longitude: gb.coords[1] },
        "en-US",
        "metric"
      ),
      duration: moment.duration(moment(b.time).diff(moment(a.time)))
    });
  }

  get(a, b) {
    return this.map.get(EdgeSet.id(a, b));
  }
}

export default class Provider extends React.Component {
  state = DEFAULT_STATE;

  constructor(props) {
    super(props);

    window.addEventListener("hashchange", () => {
      const matches = matchIDsFromLocation(window.location.hash);

      if (matches) {
        this.updateMatches(matches);
      }
    });
  }

  calculateEdges(matches) {
    const { schedule } = this.state;
    let edges = new EdgeSet(schedule, matches.length - 1);
    let previous = null;

    matches.forEach(match => {
      if (previous !== null) {
        const a = schedule.getMatch(previous);
        const b = schedule.getMatch(match);

        edges.add(a, b);
      }
      previous = match;
    });

    return edges;
  }

  addMatch(id) {
    if (!this.isMatchSelected(id)) {
      this.updateMatches([...this.state.matches, id]);
    }
  }

  isMatchSelected(id) {
    return this.state.matches.reduce(
      (found, match) => (found ? true : match === id),
      false
    );
  }

  removeMatch(id) {
    this.updateMatches(this.state.matches.filter(match => match !== id));
  }

  updateMatches(matches) {
    matches = matches.sort((a, b) => a - b);
    this.setState({
      matches,
      edges: this.calculateEdges(matches)
    });
    window.location = `#${JSON.stringify(matches)}`;
  }

  render() {
    return (
      <StateContext.Provider
        value={{
          ...this.state,
          getEdges: () => this.calculateEdges(this.state.matches),
          addMatch: id => this.addMatch(id),
          clearMatches: () => this.setState({ matches: [] }),
          isMatchSelected: id => this.isMatchSelected(id),
          removeMatch: id => this.removeMatch(id),
          setHighlightedEdge: (a, b) =>
            this.setState({ highlightedEdge: a && b ? [a, b] : null }),
          setHighlightedGround: label =>
            this.setState({ highlightedGround: label })
        }}
      >
        {this.props.children}
      </StateContext.Provider>
    );
  }
}
