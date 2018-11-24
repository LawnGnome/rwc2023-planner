import React from "react";

import MatchList from "./MatchList";
import { StateContext } from "./StateProvider";

import styles from "./Menu.module.css";

export default class Menu extends React.Component {
  state = { team: "all" };

  render() {
    const { team } = this.state;

    return (
      <StateContext.Consumer>
        {state => (
          <div className={styles.container}>
            <h2>
              <select
                className={styles.search}
                onChange={e => this.setState({ team: e.target.value })}
                value={team}
              >
                <option key="all" value="all">
                  All games
                </option>
                {Object.values(state.schedule.teams).map(team => (
                  <option key={team.name} value={team.name}>
                    {team.toEmoji()} {team.name}
                  </option>
                ))}
              </select>
            </h2>
            <MatchList
              matches={state.schedule.matches.filter(match => {
                if (!state.isMatchSelected(match.id)) {
                  return team === "all" || match.teams.indexOf(team) !== -1;
                }
                return false;
              })}
            />
          </div>
        )}
      </StateContext.Consumer>
    );
  }
}
