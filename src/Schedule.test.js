import Schedule from "./Schedule";
import ScheduleData from "./data/schedule";
import flag from "emoji-flag";

it("schedule teams", () => {
  expect(Schedule.teams.length).toBe(ScheduleData.teams.length);

  Object.entries(Schedule.teams).forEach(([name, team]) => {
    expect(ScheduleData.teams).toHaveProperty(name);
    expect(team.toEmoji()).toBe(
      team.emoji ? team.emoji : flag(team.code.toUpperCase())
    );
  });
});
