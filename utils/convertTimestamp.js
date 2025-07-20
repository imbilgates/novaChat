export const convertTimestamp = (timestamp) => {
  let date;

  // If it's a Firestore Timestamp (has .seconds)
  if (timestamp?.seconds) {
    date = new Date(timestamp.seconds * 1000);
  }
  // If it's a string (ISO or from Date.toString())
  else if (typeof timestamp === "string") {
    const parsedDate = new Date(timestamp);
    if (!isNaN(parsedDate)) {
      date = parsedDate;
    }
  }

  if (!date) return "Invalid timestamp";

  const now = new Date();

  const isSameDay = (d1, d2) =>
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();

  const isYesterday = (d) => {
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    return isSameDay(d, yesterday);
  };

  const formatTime = (date) =>
    date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  if (isSameDay(date, now)) {
    return `Today, ${formatTime(date)}`;
  } else if (isYesterday(date)) {
    return `Yesterday, ${formatTime(date)}`;
  } else {
    return `${date.toLocaleDateString()} ${formatTime(date)}`;
  }
};
