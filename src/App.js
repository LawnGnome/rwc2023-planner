import React from "react";

import Map from "./Map";
import Menu from "./Menu";
import Provider from "./StateProvider";
import Schedule from "./Schedule";

import styles from "./App.module.css";

export default class App extends React.Component {
  render() {
    return (
      <Provider>
        <div className={styles.container}>
          <div className={styles.map}>
            <Map grounds={Schedule.grounds} />
          </div>
          <div className={styles.menu}>
            <Menu schedule={Schedule} />
          </div>
        </div>
      </Provider>
    );
  }
}
