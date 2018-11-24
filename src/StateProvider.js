import React from "react";

import Schedule from "./Schedule";

let DEFAULT_MATCHES = [];

try {
  DEFAULT_MATCHES = JSON.parse(window.location.hash.replace(/^#/, ""));
} catch (e) {}

const DEFAULT_STATE = {
  highlightedGround: null,
  matches: DEFAULT_MATCHES,
  schedule: Schedule
};

export const StateContext = React.createContext(DEFAULT_STATE);

export default class Provider extends React.Component {
  state = DEFAULT_STATE;

  constructor(props) {
    super(props);

    window.addEventListener("hashchange", () => {
      try {
        this.setState({
          matches: JSON.parse(window.location.hash.replace(/^#/, ""))
        });
      } catch (e) {}
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
