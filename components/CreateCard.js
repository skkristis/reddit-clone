import msToTime from "../functions/MsToTime.js";
import elementFactory from "../functions/elementFactory.js";
import formatter from "../functions/formatter.js";

export default function createCard(obj, outputPath) {
  const output = document.querySelector(outputPath);
  const cardContainer = elementFactory("div", "card");
  cardContainer.id = obj.id;

  const score = (() => {
    const scoreContainer = elementFactory("div", "score-container");
    const score = elementFactory("p");
    const scoreValue = formatter(obj.score);
    const arrUp = elementFactory("i", "fa-solid fa-arrow-up");
    const arrDown = elementFactory("i", "fa-solid fa-arrow-down");

    score.textContent = scoreValue;

    scoreContainer.appendChild(arrUp);
    scoreContainer.appendChild(score);
    scoreContainer.appendChild(arrDown);

    return scoreContainer;
  })();

  const mainContent = (() => {
    const mainContentContainer = elementFactory("div", "feed-card-main");
    const infoHeader = (async () => {
      const author = elementFactory("a");
      const subreddit = elementFactory("a");
      const posted = elementFactory("p");
      const time = elementFactory("p");
      const infoHeaderContainer = elementFactory("div", "sub-auth");
      const awardsCountContainer = elementFactory("a");
      let awardsCount = 0;
      let timePosted = msToTime(new Date() - new Date(obj.created * 1000));

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
          const icon = elementFactory("img", "awards-icon");
          const count = elementFactory("p");
          const iconUrl = award.icon_url;

          icon.src = iconUrl;

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
      const footerContainer = elementFactory("div", "card-footer");

      const content = [
        { type: "comments", icon: "fa-regular fa-message" },
        { type: "share", icon: "fa-solid fa-share" },
        { type: " save", icon: "fa-regular fa-bookmark" },
        { type: " tip", icon: "fa-solid fa-hand-holding-dollar" },
        { type: " hide", icon: "fa-regular fa-eye-slash" },
        { type: " report", icon: "fa-regular fa-flag" },
      ];

      content.forEach((el) => {
        const containerIcons = elementFactory("div", "footer-icons");
        const button = elementFactory("button");
        const icon = elementFactory("i", el.icon);

        button.innerText = el.type !== "comments" ? el.type : `${formatter(obj.num_comments)} ${el.type}`;

        containerIcons.appendChild(icon);
        containerIcons.appendChild(button);
        footerContainer.appendChild(containerIcons);
      });

      return footerContainer;
    })();
    // mainContentContainer.appendChild(infoHeader);

    const title = elementFactory("h3");

    title.textContent = obj.title;
    title.style.marginBottom = "10px";
    mainContentContainer.appendChild(title);

    if (obj.preview) {
      let content;
      if ((obj.secure_media && obj.secure_media.reddit_video) || obj.preview.reddit_video_preview) {
        content = elementFactory("video");
        content.src = obj.secure_media.reddit_video.fallback_url || obj.preview.reddit_video_preview.fallback_url;
        content.controls = true;
      } else {
        content = elementFactory("img");
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
      const content = elementFactory("p");
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
