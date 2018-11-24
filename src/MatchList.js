import React from "react";
import PropTypes from "prop-types";
import humaniseDistance from "humanize-distance";
import moment from "moment";

// Required for humanize-distance to be able to render the distance.
import "intl/locale-data/jsonp/en-US.js";

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

            matches.forEach(match => {
              if (showEdges && previous) {
                const ga = state.schedule.grounds[previous.ground];
                const gb = state.schedule.grounds[match.ground];
                const distance = humaniseDistance(
                  { latitude: ga.coords[0], longitude: ga.coords[1] },
                  { latitude: gb.coords[0], longitude: gb.coords[1] },
                  "en-US",
                  "metric"
                );
                const duration = moment.duration(
                  moment(match.time).diff(moment(previous.time))
                );

                elements.push(
                  <li
                    className={styles.travel}
                    key={`${previous.id}-${match.id}`}
                  >
                    Travelling {distance} in {duration.humanize()}
                  </li>
                );
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
