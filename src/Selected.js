import React from "react";

import MatchList from "./MatchList";
import { StateContext } from "./StateProvider";

import styles from "./Selected.module.css";

export default class Selected extends React.Component {
  render() {
    return (
      <StateContext.Consumer>
        {state => (
          <div className={styles.container}>
            <h2>Selected games</h2>
            <MatchList
              matches={state.schedule.matches.filter(match =>
                state.isMatchSelected(match.id)
              )}
              showEdges
            />
          </div>
        )}
      </StateContext.Consumer>
    );
  }
}
