export const resHour = (h, m) => {
  let hourParse = "";
  let minParse = "";

  if (h < 10) {
    hourParse = `0${h.toString()}`;
  } else {
    hourParse = `${h.toString()}`;
  }
  if (m < 10) {
    minParse = `0${m.toString()}`;
  } else {
    minParse = `${m.toString()}`;
  }

  return `${hourParse}:${minParse}`;
};

export const timestampToDisplay = (time) => {
  const hour = time.toLocaleTimeString();
  const date = time.toLocaleDateString();

  const [month, day, year] = date.split("/");
  const dateToDisplay = [day, month, year]?.join("/");

  return `${dateToDisplay} ${hour}`;
};
