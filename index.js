// function createCard(obj) {
//   const output = document.querySelector("#feed-card-container");
//   const cardContainer = document.createElement("div");
//   cardContainer.className = "card";
//   const score = (() => {
//     const formatter = Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
//     const scoreContainer = document.createElement("div");
//     const score = document.createElement("p");
//     const scoreValue = formatter.format(obj.score);
//     const arrUp = document.createElement("i");
//     const arrDown = document.createElement("i");
//     scoreContainer.className = "score-container";
//     arrUp.className = "fa-solid fa-arrow-up";
//     arrDown.className = "fa-solid fa-arrow-down";
//     score.textContent = scoreValue;

//     scoreContainer.appendChild(arrUp);
//     scoreContainer.appendChild(score);
//     scoreContainer.appendChild(arrDown);

//     return scoreContainer;
//   })();

//   const mainContent = (() => {
//     function msToTime(ms) {
//       let seconds = (ms / 1000).toFixed(0);
//       let minutes = (ms / (1000 * 60)).toFixed(0);
//       let hours = (ms / (1000 * 60 * 60)).toFixed(0);
//       let days = (ms / (1000 * 60 * 60 * 24)).toFixed(0);
//       let months = (ms / (1000 * 60 * 60 * 24 * 30)).toFixed(0);
//       let years = (ms / (1000 * 60 * 60 * 24 * 30 * 12)).toFixed(0);

//       if (seconds < 60) {
//         return "just now";
//       } else if (minutes < 60) {
//         return minutes + " minutes ago";
//       } else if (hours < 24) {
//         return hours + " hours ago";
//       } else if (days < 30) {
//         return days + " days ago";
//       } else if (months < 12) {
//         return months + " months ago";
//       } else {
//         return years + " years ago";
//       }
//     }
//     const mainContentContainer = document.createElement("div");
//     const infoHeader = (async () => {
//       const author = document.createElement("p");
//       const subreddit = document.createElement("h4");
//       const infoHeaderContainer = document.createElement("div");
//       const awardsCountContainer = document.createElement("p");
//       let awardsCount = 0;
//       let timePosted = msToTime(new Date() - new Date(obj.created * 1000));

//       infoHeaderContainer.className = "sub-auth";
//       author.textContent = `• Posted by u/${obj.author} ${timePosted}`;
//       subreddit.textContent = obj.subreddit_name_prefixed;

//       infoHeaderContainer.appendChild(subreddit);
//       infoHeaderContainer.appendChild(author);

//       obj.all_awardings.forEach((award, i) => {
//         if (i > 3) {
//           awardsCount += award.count;
//         } else {
//           awardsCount += award.count;
//           const icon = document.createElement("img");
//           const count = document.createElement("p");
//           const iconUrl = award.icon_url;
//           icon.src = iconUrl;
//           icon.className = "awards-icon";
//           count.innerText = award.count;
//           infoHeaderContainer.appendChild(icon);
//           infoHeaderContainer.appendChild(count);
//         }
//       });
//       awardsCountContainer.innerText = `& ${awardsCount} More`;
//       infoHeaderContainer.appendChild(awardsCountContainer);

//       mainContentContainer.appendChild(infoHeaderContainer);
//     })();
//     const footerExtras = (() => {
//       const footerContainer = document.createElement("div");
//       const content = [
//         { type: "comments", icon: "fa-regular fa-message" },
//         { type: "share", icon: "fa-solid fa-share" },
//         { type: " save", icon: "fa-regular fa-bookmark" },
//         { type: " tip", icon: "fa-solid fa-hand-holding-dollar" },
//         { type: " hide", icon: "fa-regular fa-eye-slash" },
//         { type: " report", icon: "fa-regular fa-flag" },
//       ];
//       footerContainer.className = "card-footer";
//       content.forEach((el) => {
//         const containerIcons = document.createElement("div");
//         const button = document.createElement("button");
//         const icon = document.createElement("i");
//         icon.className = el.icon;
//         button.innerText = el.type === "comments" ? `${obj.num_comments} ${el.type}` : el.type;
//         containerIcons.appendChild(icon);
//         containerIcons.appendChild(button);
//         footerContainer.appendChild(containerIcons);
//       });

//       return footerContainer;
//     })();
//     // mainContentContainer.appendChild(infoHeader);

//     const title = document.createElement("h3");
//     mainContentContainer.className = "feed-card-main";

//     title.textContent = obj.title;
//     title.style.marginBottom = "10px";
//     mainContentContainer.appendChild(title);

//     if (obj.preview) {
//       let content;
//       if (obj.secure_media || obj.preview.reddit_video_preview) {
//         content = document.createElement("video");
//         content.src = obj.secure_media.reddit_video.fallback_url || obj.preview.reddit_video_preview.fallback_url;
//         content.controls = true;
//       } else {
//         content = document.createElement("img");
//         let url = obj.preview.images[0].source.url;
//         const regExpUrl = /amp;/g;
//         url = url.replaceAll(regExpUrl, "");
//         content.src = url;
//       }
//       if (obj.over_18) {
//         content.className = "blur";
//       }
//       mainContentContainer.appendChild(content);
//     } else {
//       const content = document.createElement("p");
//       content.textContent = obj.selftext;
//       mainContentContainer.appendChild(content);
//     }

//     mainContentContainer.appendChild(footerExtras);
//     return mainContentContainer;
//   })();

//   cardContainer.appendChild(score);
//   cardContainer.appendChild(mainContent);

//   output.appendChild(cardContainer);
// }
import createCard from "./components/CreateCard.js";
import popUp from "./components/PopUp.js";

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

getData("https://www.reddit.com/hot/.json?limit=5");

document.querySelector("#back-to-top").addEventListener("click", () => {
  document.documentElement.scrollTop = 0;
});

document.querySelector("#feed-card-container").addEventListener("click", (e) => {
  if (e.target.id !== "feed-card-container") {
    let targetContainer = e.target;
    while (targetContainer.className !== "card") {
      targetContainer = targetContainer.parentNode;
    }
    popUp(targetContainer.id);
  }
});

document.addEventListener("scroll", () => {
  // only designing HOT section, would require switch for others, not doing right now

  if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 100 && canLoad) {
    canLoad = false;
    getData(`https://www.reddit.com/hot/.json?limit=5&after=${lastLoadedId}`, true);
  }
});
