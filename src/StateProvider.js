import React from "react";

const DEFAULT_STATE = {
  highlightedGround: null,
  matches: []
};

export const StateContext = React.createContext(DEFAULT_STATE);

export default class Provider extends React.Component {
  state = DEFAULT_STATE;

  // TODO: logic to set the matches from the window.location, and update it as
  // we go.

  addMatch(id) {
    this.setState({
      matches: [...this.state.matches, id].sort((a, b) => {
        return a.id - b.id;
      })
    });
  }

  removeMatch(id) {
    this.setState({
      matches: this.state.matches.filter(match => match.id !== id)
    });
  }

  render() {
    return (
      <StateContext.Provider
        value={{
          ...this.state,
          addMatch: id => this.addMatch(id),
          clearMatches: () => this.setState({ matches: [] }),
          isMatchSelected: id =>
            this.state.matches.reduce(
              (found, match) => (found ? true : match.id === id),
              false
            ),
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
