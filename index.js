import createCard from "./components/CreateCard.js";
import popUp from "./components/PopUp.js";
import msToTime from "./components/MsToTime.js";

let lastLoadedId = undefined;
let canLoad = false;

async function getData(url, scroll = false) {
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
}

{
  //search url
  // fetch("https://www.reddit.com/search/.json?q=javascript")
  //   .then((r) => r.json())
  //   .then((r) => {
  //     console.log(r);
  //   });
}

document.querySelector("#feed-selection").addEventListener("click", (e) => {
  if (e.target.className.includes("btn-filter")) {
    if (e.target.id.includes("top")) {
      document.querySelector("#top-time-frame").className = "btn-filter top-display";
    } else {
      document.querySelector("#top-time-frame").className = "top-display-hidden";
    }

    function toggle() {
      [...document.querySelectorAll(".btn-filter")].map((btn) => {
        btn.className = "btn-filter";
      });
      e.target.className = "btn-clicked btn-filter";
    }

    switch (e.target.value) {
      case "hot":
      case "global":
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

document.querySelector("#back-to-top").addEventListener("click", () => {
  document.documentElement.scrollTop = 0;
});

document.querySelector("#feed-card-container").addEventListener("click", (e) => {
  console.log(e.target);
  let targetContainer = e.target;
  let mainContainerId = null;

  while (targetContainer.className !== "card") {
    targetContainer = targetContainer.parentNode;
  }

  mainContainerId = targetContainer.id;

  if (e.target.id !== "feed-card-container") {
    if (e.target.id.match("user/")) {
      // console.log("user");
      // fetches only comments by user, not gonna implement atm
    } else if (e.target.id.match("r/")) {
      (async () => {
        const subreddit = document.createElement("h1");
        let obj = await fetch(`https://www.reddit.com/${e.target.id}/.json?limit=25`);
        obj = await obj.json();
        subreddit.innerText = `Welcome to ${e.target.id}!`;
        console.log(obj);
        document.querySelector("#feed-card-container").innerHTML = "";
        document.querySelector("#feed-card-container").appendChild(subreddit);

        obj.data.children.forEach((obj) => {
          createCard(obj.data, "#feed-card-container");
        });
      })();
      console.log("sub");
    } else if (e.target.id.match("more!")) {
      (async () => {
        let obj = await fetch(`https://www.reddit.com/${mainContainerId}/.json`);
        obj = await obj.json();

        obj = obj[0].data.children[0].data;
        const author = document.createElement("a");
        const subreddit = document.createElement("a");
        const posted = document.createElement("p");
        const time = document.createElement("p");
        const infoHeaderContainer = document.createElement("div");
        let timePosted = msToTime(new Date() - new Date(obj.created * 1000));

        infoHeaderContainer.className = "sub-auth";
        posted.innerText = "• Posted by ";
        author.textContent = `u/${obj.author}`;
        author.id = `user/${obj.author}`;
        subreddit.textContent = obj.subreddit_name_prefixed;
        subreddit.id = obj.subreddit_name_prefixed;
        time.innerText = timePosted;

        infoHeaderContainer.appendChild(subreddit);
        infoHeaderContainer.appendChild(posted);
        infoHeaderContainer.appendChild(author);
        infoHeaderContainer.appendChild(time);

        obj.all_awardings.forEach((award) => {
          const icon = document.createElement("img");
          const count = document.createElement("p");
          const iconUrl = award.icon_url;

          icon.src = iconUrl;
          icon.className = "awards-icon";

          count.innerText = award.count;
          infoHeaderContainer.appendChild(icon);
          infoHeaderContainer.appendChild(count);
        });

        let targetHeader = e.target;
        while (targetHeader.className !== "sub-auth") {
          targetHeader = targetHeader.parentNode;
        }
        targetHeader.parentNode.prepend(infoHeaderContainer);
        targetHeader.remove();
      })();
    } else {
      popUp(mainContainerId);
    }
  }
});

document.addEventListener("scroll", () => {
  // only designing HOT section, would require switch for others, not doing right now

  if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 100 && canLoad) {
    canLoad = false;
    getData(`https://www.reddit.com/hot/.json?limit=5&after=${lastLoadedId}`, true);
  }
});

document.querySelector("#icon-header").addEventListener("click", () => {
  getData("https://www.reddit.com/hot/.json?limit=5");
});

getData("https://www.reddit.com/hot/.json?limit=5");
