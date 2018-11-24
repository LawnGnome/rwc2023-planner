import React from "react";

import Map from "./Map";
import Menu from "./Menu";
import Provider from "./StateProvider";
import Selected from "./Selected";

import styles from "./App.module.css";

export default class App extends React.Component {
  render() {
    return (
      <Provider>
        <div className={styles.container}>
          <div className={styles.map}>
            <Map />
          </div>
          <div className={styles.selected}>
            <Selected />
          </div>
          <div className={styles.menu}>
            <Menu />
          </div>
        </div>
      </Provider>
    );
  }
}
