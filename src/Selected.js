import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import MatchList from "./MatchList";
import { StateContext } from "./StateProvider";

import styles from "./Selected.module.css";

export default class Selected extends React.Component {
  render() {
    return (
      <StateContext.Consumer>
        {state => (
          <div className={styles.container}>
            <h2>
              <span>Selected games</span>
              <button onClick={() => state.clearMatches()}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </h2>
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
