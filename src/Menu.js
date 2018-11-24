import React from "react";
import PropTypes from "prop-types";
import moment from "moment";

import { StateContext } from "./StateProvider";

import styles from "./Menu.module.css";

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

export default class Menu extends React.Component {
  static propTypes = {
    schedule: PropTypes.object.isRequired
  };

  state = { team: "all" };

  render() {
    const { schedule } = this.props;
    const { team } = this.state;

    return (
      <StateContext.Consumer>
        {state => (
          <div className={styles.container}>
            <select
              className={styles.search}
              onChange={e => this.setState({ team: e.target.value })}
              value={team}
            >
              <option key="all" value="all">
                All games
              </option>
              {Object.values(schedule.teams).map(team => (
                <option key={team.name} value={team.name}>
                  {team.toEmoji()} {team.name}
                </option>
              ))}
            </select>
            <ul>
              {schedule.matches
                .filter(match =>
                  team !== "all" ? match.teams.indexOf(team) !== -1 : true
                )
                .map(match => (
                  <li className={styles.match} key={match.id}>
                    <span className={styles.time}>
                      {moment(match.time).format("ddd D/M")}
                    </span>
                    <span className={styles.teams}>
                      {match.teams.map(team => (
                        <Team key={team} team={schedule.teams[team]} />
                      ))}
                    </span>
                    <span className={styles.ground}>{match.ground}</span>
                    <span className={styles.modify}>
                      {state.isMatchSelected(match.id) ? "-" : "+"}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </StateContext.Consumer>
    );
  }
}
