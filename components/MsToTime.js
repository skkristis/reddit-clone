export default function msToTime(ms) {
  let seconds = (ms / 1000).toFixed(0);
  let minutes = (ms / (1000 * 60)).toFixed(0);
  let hours = (ms / (1000 * 60 * 60)).toFixed(0);
  let days = (ms / (1000 * 60 * 60 * 24)).toFixed(0);
  let months = (ms / (1000 * 60 * 60 * 24 * 30)).toFixed(0);
  let years = (ms / (1000 * 60 * 60 * 24 * 30 * 12)).toFixed(0);

  if (seconds < 60) {
    return "just now";
  } else if (minutes < 60) {
    return minutes + " minutes ago";
  } else if (hours < 24) {
    return hours + " hours ago";
  } else if (days < 30) {
    return days + " days ago";
  } else if (months < 12) {
    return months + " months ago";
  } else {
    return years + " years ago";
  }
}
