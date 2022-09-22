import msToTime from "../components/MsToTime.js";

export default function createCard(obj, outputPath) {
  const output = document.querySelector(outputPath);
  const cardContainer = document.createElement("div");
  cardContainer.className = "card";
  cardContainer.id = obj.id;
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
    const infoHeader = (async () => {
      const author = document.createElement("a");
      const subreddit = document.createElement("a");
      const posted = document.createElement("p");
      const time = document.createElement("p");
      const infoHeaderContainer = document.createElement("div");
      const awardsCountContainer = document.createElement("a");
      let awardsCount = 0;
      let timePosted = msToTime(new Date() - new Date(obj.created * 1000));

      infoHeaderContainer.className = "sub-auth";
      posted.innerText = "• Posted by ";
      author.textContent = `u/${obj.author}`;
      author.id = `user/${obj.author}`;
      subreddit.textContent = obj.subreddit_name_prefixed;
      subreddit.id = obj.subreddit_name_prefixed;
      time.innerText = timePosted;
      awardsCountContainer.id = "more!";

      infoHeaderContainer.appendChild(subreddit);
      infoHeaderContainer.appendChild(posted);
      infoHeaderContainer.appendChild(author);
      infoHeaderContainer.appendChild(time);

      obj.all_awardings.forEach((award, i) => {
        if (i > 3) {
          awardsCount += award.count;
        } else {
          const icon = document.createElement("img");
          const count = document.createElement("p");
          const iconUrl = award.icon_url;

          icon.src = iconUrl;
          icon.className = "awards-icon";

          count.innerText = award.count;
          infoHeaderContainer.appendChild(icon);
          infoHeaderContainer.appendChild(count);
        }
      });
      if (awardsCount > 0) {
        awardsCountContainer.innerText = `& ${awardsCount} More`;
      }
      infoHeaderContainer.appendChild(awardsCountContainer);

      mainContentContainer.appendChild(infoHeaderContainer);
    })();

    const footerExtras = (() => {
      const footerContainer = document.createElement("div");
      const formatter = Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

      const content = [
        { type: "comments", icon: "fa-regular fa-message" },
        { type: "share", icon: "fa-solid fa-share" },
        { type: " save", icon: "fa-regular fa-bookmark" },
        { type: " tip", icon: "fa-solid fa-hand-holding-dollar" },
        { type: " hide", icon: "fa-regular fa-eye-slash" },
        { type: " report", icon: "fa-regular fa-flag" },
      ];

      footerContainer.className = "card-footer";

      content.forEach((el) => {
        const containerIcons = document.createElement("div");
        const button = document.createElement("button");
        const icon = document.createElement("i");

        containerIcons.className = "footer-icons";
        icon.className = el.icon;
        button.innerText = el.type !== "comments" ? el.type : `${formatter.format(obj.num_comments)} ${el.type}`;

        containerIcons.appendChild(icon);
        containerIcons.appendChild(button);
        footerContainer.appendChild(containerIcons);
      });

      return footerContainer;
    })();
    // mainContentContainer.appendChild(infoHeader);

    const title = document.createElement("h3");
    mainContentContainer.className = "feed-card-main";

    title.textContent = obj.title;
    title.style.marginBottom = "10px";
    mainContentContainer.appendChild(title);

    if (obj.preview) {
      let content;
      if ((obj.secure_media && obj.secure_media.reddit_video) || obj.preview.reddit_video_preview) {
        content = document.createElement("video");
        content.src = obj.secure_media.reddit_video.fallback_url || obj.preview.reddit_video_preview.fallback_url;
        content.controls = true;
      } else {
        content = document.createElement("img");
        let url = obj.preview.images[0].source.url;
        const regExpUrl = /amp;/g;
        url = url.replaceAll(regExpUrl, "");
        content.src = url;
      }
      if (obj.over_18) {
        content.className = "blur";
      }
      mainContentContainer.appendChild(content);
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
