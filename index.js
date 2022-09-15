function createCard(obj) {
  const output = document.querySelector("#feed-card-container");
  const container = document.createElement("div");
  const title = document.createElement("h3");
  container.className = "feed-card";

  title.textContent = obj.title;
  container.appendChild(title);

  if (obj.url && obj.url.match(/https:\/\/i.redd.it\//)) {
    const img = document.createElement("img");
    img.src = obj.url;
    container.appendChild(img);
  } else {
    const content = document.createElement("p");
    content.textContent = obj.selftext;
    container.appendChild(content);
  }
  output.appendChild(container);
}

async function getData() {
  let data = await fetch("https://www.reddit.com/hot/.json").then((resp) => resp.json());
  console.log(data);

  data.data.children.map((obj) => {
    createCard(obj.data);
  });
}

getData();
{
  // fetch("https://www.reddit.com/search/.json?q=javascript")
  //   .then((r) => r.json())
  //   .then((r) => {
  //     console.log(r);
  //   });
}
