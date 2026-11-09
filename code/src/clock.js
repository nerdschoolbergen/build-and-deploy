export const getTimeString = (now) => {
    const hour = now.getHours();
    const minute = now.getMinutes();
    const seconds = now.getSeconds();
    return `${hour}:${minute}:${seconds}`
}

// Midnight on January 1st next year, in the user's local time zone
const getNextYearDate = (now) => new Date(now.getFullYear() + 1, 0, 1);

export const getSecondsLeftOfYear = (now) => {
    const startOfNextYear = getNextYearDate(now);
    const startOfNextYearMillis = startOfNextYear.getTime();
    const nowMillis = now.getTime();
    return Math.floor((startOfNextYearMillis - nowMillis) / 1000);
}
