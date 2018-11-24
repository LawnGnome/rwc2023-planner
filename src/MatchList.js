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
    matches: PropTypes.array.isRequired
  };

  render() {
    const { matches } = this.props;

    return (
      <StateContext.Consumer>
        {state => (
          <ul className={styles.list}>
            {matches.map(match => (
              <li
                className={styles.match}
                key={match.id}
                onMouseOver={() => state.setHighlightedGround(match.ground)}
                onMouseOut={() =>
                  state.highlightedGround === match.ground
                    ? state.setHighlightedGround(null)
                    : false
                }
              >
                <span className={styles.time}>
                  {moment(match.time).format("ddd D/M")}
                </span>
                <span className={styles.teams}>
                  {match.teams.map(team => (
                    <Team key={team} team={state.schedule.teams[team]} />
                  ))}
                </span>
                <span className={styles.ground}>{match.ground}</span>
                <span className={styles.modify}>
                  {state.isMatchSelected(match.id) ? (
                    <button onClick={() => state.removeMatch(match.id)}>
                      -
                    </button>
                  ) : (
                    <button onClick={() => state.addMatch(match.id)}>+</button>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}
      </StateContext.Consumer>
    );
  }
}
