import getData from "../functions/getData.js";

export default function search() {
  const inputValue = document.querySelector("#search").value;
  const url = `https://www.reddit.com/search/.json?q=${inputValue}`;

  getData(url);
}
