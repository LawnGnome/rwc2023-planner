import ScheduleData from "./schedule";

it("defines all grounds", () => {
  ScheduleData.matches.forEach(match => {
    expect(ScheduleData.grounds).toHaveProperty(match.ground);
  });
});

it("defines all teams", () => {
  ScheduleData.matches.forEach(match => {
    match.teams.forEach(team => {
      expect(ScheduleData.teams).toHaveProperty(team);
    });
  });
});
