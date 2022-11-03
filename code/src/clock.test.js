import { getSecondsLeftOfYear, getTimeString } from "./clock";

test('getTimeString formats time string correctly', () => {
    const now = new Date(0, 0, 0, 10, 20, 30);
    const timeString = getTimeString(now);
    expect(timeString).toBe('10:20:30');
});

test('getSecondsLeftOfYear returns the correct amount of seconds', () => {
    const now = new Date("2022-12-31T23:00:00.000Z");
    const timeString = getSecondsLeftOfYear(now);
    expect(timeString).toBe(3600);
});

