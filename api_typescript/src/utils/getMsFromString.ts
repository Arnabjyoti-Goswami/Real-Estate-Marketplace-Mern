const getMsFromString = (timeStr: string): number => {
  const time = timeStr.slice(0, -1);
  const unit = timeStr.slice(-1);
  const timeInMs = Number(time) * 1000;
  switch (unit) {
    case 's':
      return timeInMs;
    case 'm':
      return timeInMs * 60;
    case 'h':
      return timeInMs * 60 * 60;
    case 'd':
      return timeInMs * 60 * 60 * 24;
    default:
      return 0;
  }
};

export default getMsFromString;