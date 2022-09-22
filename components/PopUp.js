import msToTime from "../components/MsToTime.js";

export default async function popUp(id) {
  function createCard(obj, outputPath) {
    const output = document.querySelector(outputPath);
    const cardContainer = document.createElement("div");
    cardContainer.className = "card-popped";
    cardContainer.id = obj.id;
    const score = (() => {
      const formatter = Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
      const scoreContainer = document.createElement("div");
      const score = document.createElement("p");
      const scoreValue = formatter.format(obj.score);
      const arrUp = document.createElement("i");
      const arrDown = document.createElement("i");
      scoreContainer.className = "score-container-popped";
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
        const infoHeaderContainer = document.createElement("div");
        const awardsCountContainer = document.createElement("a");
        let awardsCount = 0;
        let timePosted = msToTime(new Date() - new Date(obj.created * 1000));

        infoHeaderContainer.className = "sub-auth";
        author.textContent = `• Posted by u/${obj.author} ${timePosted}`;
        subreddit.textContent = obj.subreddit_name_prefixed;

        infoHeaderContainer.appendChild(subreddit);
        infoHeaderContainer.appendChild(author);

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

  function createComments(obj, outputPath) {
    const output = document.querySelector(outputPath);
    const container = document.createElement("div");
    const header = (() => {
      const awardsCountContainer = document.createElement("a");
      const commentsHeader = document.createElement("div");
      const author = document.createElement("a");
      let awardsCount = 0;
      let timePosted = msToTime(new Date() - new Date(obj.created * 1000));

      commentsHeader.className = "sub-auth";
      author.textContent = `${obj.author} ${timePosted}`;

      commentsHeader.appendChild(author);
      if (obj.all_awardings) {
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
            commentsHeader.appendChild(icon);
            commentsHeader.appendChild(count);
          }
        });
        if (awardsCount > 0) {
          awardsCountContainer.innerText = `& ${awardsCount} More`;
        }
        commentsHeader.appendChild(awardsCountContainer);
      }

      return commentsHeader;
    })();
    const content = document.createElement("p");
    const footerExtras = (() => {
      const footerContainer = document.createElement("div");
      const formatter = Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
      const score = (() => {
        const scoreContainer = document.createElement("div");
        const score = document.createElement("p");
        const scoreValue = formatter.format(obj.score);
        const arrUp = document.createElement("i");
        const arrDown = document.createElement("i");
        scoreContainer.className = "score-container-popup comments";
        arrUp.className = "fa-solid fa-arrow-up";
        arrDown.className = "fa-solid fa-arrow-down";
        score.textContent = scoreValue;

        scoreContainer.appendChild(arrUp);
        scoreContainer.appendChild(score);
        scoreContainer.appendChild(arrDown);

        return scoreContainer;
      })();
      const content = [{ type: "Reply", icon: "fa-regular fa-message" }, { type: "Share" }, { type: "Report" }, { type: "Save" }, { type: "Tip", icon: "fa-solid fa-hand-holding-dollar" }, { type: "Follow" }];

      footerContainer.className = "card-footer";
      footerContainer.appendChild(score);

      content.forEach((el) => {
        const containerIcons = document.createElement("div");
        const button = document.createElement("button");
        if (el.icon) {
          const icon = document.createElement("i");
          icon.className = el.icon;
          containerIcons.appendChild(icon);
        }

        containerIcons.className = "footer-icons";
        button.innerText = el.type;

        containerIcons.appendChild(button);
        footerContainer.appendChild(containerIcons);
      });

      return footerContainer;
    })();

    container.className = "comment-container";
    content.innerText = obj.body;

    container.appendChild(header);
    container.appendChild(content);
    container.appendChild(footerExtras);

    output.appendChild(container);
  }

  document.querySelector("#feed-card-container").classList.toggle("display-none");

  const popUpContainer = document.createElement("div");
  const popUpContentContainer = document.createElement("div");
  const popCard = document.createElement("div");
  const headerContainer = document.createElement("div");

  headerContainer.className = "pop-up-header";
  popCard.className = "pop-up-card-container";

  popUpContentContainer.appendChild(headerContainer);
  popUpContentContainer.appendChild(popCard);

  popUpContainer.className = "clicked-container";
  popUpContentContainer.className = "clicked";

  popUpContainer.appendChild(popUpContentContainer);
  document.querySelector("#feed").appendChild(popUpContainer);

  let postData = await fetch(`https://www.reddit.com/${id}/.json`);
  postData = await postData.json();
  postData = {
    post: postData[0].data.children[0].data,
    comments: postData[1].data.children,
  };

  const score = (() => {
    const formatter = Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
    const scoreContainer = document.createElement("div");
    const score = document.createElement("p");
    const scoreValue = formatter.format(postData.post.score);
    const arrUp = document.createElement("i");
    const arrDown = document.createElement("i");
    scoreContainer.className = "score-container-popup";
    arrUp.className = "fa-solid fa-arrow-up";
    arrDown.className = "fa-solid fa-arrow-down";
    score.textContent = scoreValue;

    scoreContainer.appendChild(arrUp);
    scoreContainer.appendChild(score);
    scoreContainer.appendChild(arrDown);

    return scoreContainer;
  })();

  const title = document.createElement("h3");
  const close = document.createElement("button");
  const closeIcon = document.createElement("i");
  const closeText = document.createElement("p");
  closeIcon.className = "fa-solid fa-x";
  close.className = "pop-close";

  title.innerText = postData.post.title;
  closeText.innerText = "Close";

  close.appendChild(closeIcon);
  close.appendChild(closeText);

  headerContainer.appendChild(score);
  headerContainer.appendChild(title);
  headerContainer.appendChild(close);

  createCard(postData.post, ".pop-up-card-container");

  postData.comments.forEach((obj) => createComments(obj.data, ".pop-up-card-container"));

  document.querySelector(".clicked-container").addEventListener("click", (e) => {
    console.log(e.target);
    console.log(e.target.className);
    if (e.target.innerText === "Close" || e.target.className.match("fa-x") || e.target.className === "clicked-container") {
      document.querySelector(".clicked-container").remove();
      document.querySelector("#feed-card-container").classList.toggle("display-none");
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Esc" || e.key === "Escape" || e.keyCode === 27) {
      document.querySelector(".clicked-container").remove();
      document.querySelector("#feed-card-container").classList.toggle("display-none");
    }
  });
}
