import createCard from "../components/CreateCard.js";

let lastLoadedId = undefined;
let canLoad = false;

export default async function getData(url, scroll = false) {
  let data = await fetch(url);
  data = await data.json();

  console.log(data);
  if (!scroll) {
    document.querySelector("#feed-card-container").innerHTML = "";
  }
  data.data.children.forEach((obj) => {
    createCard(obj.data, "#feed-card-container");
  });

  lastLoadedId = `t3_${data.data.children[data.data.children.length - 1].data.id}`;
  canLoad = true;

  document.addEventListener("scroll", () => {
    // only designing HOT section, would require switch for others, not doing right now

    if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 100 && canLoad) {
      canLoad = false;
      getData(`https://www.reddit.com/hot/.json?limit=5&after=${lastLoadedId}`, true);
    }
  });
}
