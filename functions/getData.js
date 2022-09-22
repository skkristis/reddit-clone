import createCard from "../components/CreateCard.js";

let lastLoadedId = undefined;

export default async function getData(url, scroll = false, sub = false, subName) {
  if (sub) {
    document.querySelector("#feed-card-container").innerHTML = "";

    const subreddit = document.createElement("h1");
    subreddit.innerText = `Welcome to ${subName}!`;
    document.querySelector("#feed-card-container").appendChild(subreddit);
  }

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

  const loadMore = document.createElement("button");
  loadMore.className = "load-more-btn";
  loadMore.innerText = "Load more?";

  document.querySelector("#feed-card-container").appendChild(loadMore);

  document.querySelector(".load-more-btn").addEventListener("click", (e) => {
    e.target.remove();
    getData(`${url}&after=${lastLoadedId}`, true);
  });
}
