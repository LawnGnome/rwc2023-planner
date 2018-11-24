import Data from "./data/schedule";
import flag from "emoji-flag";

class Schedule {
  constructor(data) {
    this.grounds = data.grounds;
    this.teams = Object.assign(
      {},
      ...Object.entries(data.teams).map(([key, value]) => ({
        [key]: new Team(key, value)
      }))
    );
    this.matches = data.matches;
  }

  getMatch(id) {
    for (const match of this.matches) {
      if (match.id === id) {
        return match;
      }
    }

    return undefined;
  }
}

class Team {
  constructor(name, value) {
    this.code = value.code;
    this.emoji = value.emoji;
    this.name = name;
  }

  toEmoji() {
    return this.emoji ? this.emoji : flag(this.code.toUpperCase());
  }
}

export default new Schedule(Data);
