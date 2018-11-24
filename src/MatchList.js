import React from "react";
import PropTypes from "prop-types";
import moment from "moment";

import { StateContext } from "./StateProvider";

import styles from "./MatchList.module.css";

class Team extends React.Component {
  static propTypes = {
    team: PropTypes.object.isRequired
  };

  render() {
    const { team } = this.props;

    return (
      <span className={styles.team}>
        <span className={styles.emoji}>{team.toEmoji()}</span>
        <span className={styles.name}>{team.name}</span>
      </span>
    );
  }
}

export default class MatchList extends React.Component {
  static propTypes = {
    matches: PropTypes.array.isRequired,
    showEdges: PropTypes.bool
  };

  render() {
    const { matches, showEdges } = this.props;

    return (
      <ul className={styles.list}>
        <StateContext.Consumer>
          {state => {
            let elements = [];
            let previous = null;
            const edges = showEdges ? state.getEdges() : null;

            matches.forEach((match, i) => {
              if (showEdges && previous) {
                const edge = edges.get(previous, match);

                if (edge) {
                  elements.push(
                    <li
                      className={styles.travel}
                      key={`${previous.id}-${match.id}`}
                      style={{ color: `#${edge.colour}` }}
                      onMouseOver={() =>
                        state.setHighlightedEdge(
                          edge.a.match.id,
                          edge.b.match.id
                        )
                      }
                      onMouseOut={() =>
                        state.highlightedEdge &&
                        state.highlightedEdge[0] === edge.a.match.id &&
                        state.highlightedEdge[1] === edge.b.match.id
                          ? state.setHighlightedEdge(null)
                          : false
                      }
                    >
                      Travelling {edge.distance} in {edge.duration.humanize()}
                    </li>
                  );
                }
              }

              elements.push(
                <li
                  className={styles.match}
                  key={match.id}
                  onMouseOver={() => state.setHighlightedGround(match.ground)}
                  onMouseOut={() =>
                    state.highlightedGround === match.ground
                      ? state.setHighlightedGround(null)
                      : false
                  }
                  onClick={() =>
                    state.isMatchSelected(match.id)
                      ? state.removeMatch(match.id)
                      : state.addMatch(match.id)
                  }
                >
                  <span className={styles.time}>
                    {moment(match.time).format("ddd D/M")}
                  </span>
                  {match.teams.map(team => (
                    <Team key={team} team={state.schedule.teams[team]} />
                  ))}
                  <span className={styles.ground}>{match.ground}</span>
                </li>
              );

              previous = match;
            });

            return elements;
          }}
        </StateContext.Consumer>
      </ul>
    );
  }
}
