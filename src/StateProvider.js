import React from "react";

import Schedule from "./Schedule";

function matchIDsFromLocation(hash) {
  try {
    return JSON.parse(hash.replace(/^#/, ""));
  } catch (e) {
    return undefined;
  }
}

const DEFAULT_STATE = {
  highlightedGround: null,
  matches: matchIDsFromLocation(window.location.hash),
  schedule: Schedule
};

export const StateContext = React.createContext(DEFAULT_STATE);

export default class Provider extends React.Component {
  state = DEFAULT_STATE;

  constructor(props) {
    super(props);

    window.addEventListener("hashchange", () => {
      const matches = matchIDsFromLocation(window.location.hash);

      if (matches) {
        this.setState({ matches });
      }
    });
  }

  addMatch(id) {
    if (!this.isMatchSelected(id)) {
      const matches = [...this.state.matches, id].sort((a, b) => {
        return a.id - b.id;
      });

      this.setState({ matches });
      window.location = `#${JSON.stringify(matches)}`;
    }
  }

  isMatchSelected(id) {
    return this.state.matches.reduce(
      (found, match) => (found ? true : match === id),
      false
    );
  }

  removeMatch(id) {
    const matches = this.state.matches.filter(match => match !== id);

    this.setState({ matches });
    window.location = `#${JSON.stringify(matches)}`;
  }

  render() {
    return (
      <StateContext.Provider
        value={{
          ...this.state,
          addMatch: id => this.addMatch(id),
          clearMatches: () => this.setState({ matches: [] }),
          isMatchSelected: id => this.isMatchSelected(id),
          removeMatch: id => this.removeMatch(id),
          setHighlightedGround: label =>
            this.setState({ highlightedGround: label })
        }}
      >
        {this.props.children}
      </StateContext.Provider>
    );
  }
}
