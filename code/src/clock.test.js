import { getSecondsLeftOfYear, getTimeString } from "./clock";

test('getTimeString formats time string correctly', () => {
    const now = new Date(2022, 0, 1, 10, 20, 30);
    const timeString = getTimeString(now);
    expect(timeString).toBe('10:20:30');
});

test('getSecondsLeftOfYear returns the correct amount of seconds', () => {
    // 23:00 local time on December 31st
    const now = new Date(2022, 11, 31, 23, 0, 0);
    const secondsLeft = getSecondsLeftOfYear(now);
    expect(secondsLeft).toBe(3600);
});

test('getSecondsLeftOfYear counts down to local midnight, not UTC midnight', () => {
    // 23:30 local time on December 31st
    const now = new Date(2026, 11, 31, 23, 30, 0);
    expect(getSecondsLeftOfYear(now)).toBe(1800);
});
