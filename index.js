function createCard(obj) {
  const output = document.querySelector("#feed-card-container");
  const cardContainer = document.createElement("div");
  cardContainer.className = "card";
  const score = (() => {
    const formatter = Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
    const scoreContainer = document.createElement("div");
    const score = document.createElement("p");
    const scoreValue = formatter.format(obj.score);
    const arrUp = document.createElement("i");
    const arrDown = document.createElement("i");
    scoreContainer.className = "score-container";
    arrUp.className = "fa-solid fa-arrow-up";
    arrDown.className = "fa-solid fa-arrow-down";
    score.textContent = scoreValue;

    scoreContainer.appendChild(arrUp);
    scoreContainer.appendChild(score);
    scoreContainer.appendChild(arrDown);

    return scoreContainer;
  })();

  const mainContent = (() => {
    const mainContentContainer = document.createElement("div");
    const infoHeader = (() => {
      const author = document.createElement("p");
      const subreddit = document.createElement("h4");
      const infoHeaderContainer = document.createElement("div");

      infoHeaderContainer.className = "sub-auth";
      author.textContent = `• ${obj.author}`;
      subreddit.textContent = obj.subreddit_name_prefixed;

      infoHeaderContainer.appendChild(subreddit);
      infoHeaderContainer.appendChild(author);

      return infoHeaderContainer;
    })();
    const footerExtras = (() => {
      const footerContainer = document.createElement("div");
      const content = [
        { type: "comments", icon: "fa-regular fa-message" },
        { type: "share", icon: "fa-solid fa-share" },
        { type: " save", icon: "fa-regular fa-bookmark" },
        { type: " tip", icon: "fa-solid fa-hand-holding-dollar" },
        { type: " hide", icon: "fa-regular fa-eye-slash" },
        { type: " report", icon: "fa-regular fa-flag" },
      ];
      footerContainer.className = "card-footer";
      content.map((el) => {
        const containerIcons = document.createElement("div");
        const button = document.createElement("button");
        const icon = document.createElement("i");
        icon.className = el.icon;
        button.innerText = el.type === "comments" ? `${obj.num_comments} ${el.type}` : el.type;
        containerIcons.appendChild(icon);
        containerIcons.appendChild(button);
        footerContainer.appendChild(containerIcons);
      });

      return footerContainer;
    })();
    mainContentContainer.appendChild(infoHeader);

    const title = document.createElement("h3");
    mainContentContainer.className = "feed-card-main";

    title.textContent = obj.title;
    title.style.marginBottom = "10px";
    mainContentContainer.appendChild(title);

    if (obj.preview) {
      const img = document.createElement("img");
      let url = obj.preview.images[0].source.url;
      const regExpUrl = /amp;/g;
      url = url.replaceAll(regExpUrl, "");
      img.src = url;
      mainContentContainer.appendChild(img);
    } else {
      const content = document.createElement("p");
      content.textContent = obj.selftext;
      mainContentContainer.appendChild(content);
    }

    mainContentContainer.appendChild(footerExtras);
    return mainContentContainer;
  })();

  cardContainer.appendChild(score);
  cardContainer.appendChild(mainContent);

  output.appendChild(cardContainer);
}

async function getData(url) {
  let data = await fetch(url);
  data = await data.json();
  console.log(data.data.children);
  data.data.children.map((obj) => {
    createCard(obj.data);
  });
}

{
  // fetch("https://www.reddit.com/search/.json?q=javascript")
  //   .then((r) => r.json())
  //   .then((r) => {
  //     console.log(r);
  //   });
}

document.querySelector("#feed-selection").addEventListener("click", (e) => {
  console.log(e.target);
  if (e.target.className.includes("btn-filter")) {
    document.querySelector("#feed-card-container").innerHTML = "";

    if (e.target.id.includes("top")) {
      document.querySelector("#top-time-frame").style.display = "inline-block";
    } else {
      document.querySelector("#top-time-frame").style.display = "none";
    }

    function toggle() {
      [...document.querySelectorAll(".btn-filter")].map((btn) => {
        btn.className = "btn-filter";
      });
      e.target.className = "btn-clicked btn-filter";
    }

    switch (e.target.value) {
      case "hot" || "global":
        getData("https://www.reddit.com/hot/.json");
        break;
      // case "US":
      //   getData("https://www.reddit.com/r/popular/.json?geo_filter=US");
      //   break;
      case "new":
        getData("https://www.reddit.com/new/.json");
        break;
      case "top":
        getData("https://www.reddit.com/top/.json");
        break;
      case "now":
        getData("https://www.reddit.com/top/.json?t=hour");
        break;
      case "today":
        getData("https://www.reddit.com/top/.json?t=day");
        break;
      case "thisWeek":
        getData("https://www.reddit.com/top/.json?t=week");
        break;
      case "thisMonth":
        getData("https://www.reddit.com/top/.json?t=month");
        break;
      case "thisYear":
        getData("https://www.reddit.com/top/.json?t=year");
        break;
      case "allTime":
        getData("https://www.reddit.com/top/.json?t=all");
        break;
      case "rising":
        getData("https://www.reddit.com/rising/.json");
        break;
    }
    toggle();
  }
});

getData("https://www.reddit.com/hot/.json");
