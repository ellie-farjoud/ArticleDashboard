const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function convertDate(stringDate) {
  const date = new Date(stringDate);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  var stringTime = `${hours}:${minutes}:${seconds}`;

  const formattedDate = `${date.getDate()} ${
    MONTHS[date.getMonth()]
  } ${date.getFullYear()} ${stringTime}`;

  return formattedDate;
}
