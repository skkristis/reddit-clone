import msToTime from "../functions/MsToTime.js";
import elementFactory from "../functions/elementFactory.js";
import formatter from "../functions/formatter.js";
import createFeed from "../components/CreateCard.js";

export default async function popUp(id) {
  function createCard(obj, outputPath) {
    const output = document.querySelector(outputPath);
    const cardContainer = elementFactory("div", "card-popped");
    cardContainer.id = obj.id;

    const score = (() => {
      const scoreContainer = elementFactory("div", "score-container-popped");
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

  function createComments(obj, outputPath) {
    const output = document.querySelector(outputPath);
    const container = elementFactory("div", "comment-container");
    const header = (() => {
      const awardsCountContainer = elementFactory("a");
      const commentsHeader = elementFactory("div", "sub-auth");
      const author = elementFactory("a");
      let awardsCount = 0;
      let timePosted = msToTime(new Date() - new Date(obj.created * 1000));

      author.textContent = `${obj.author} ${timePosted}`;

      commentsHeader.appendChild(author);
      if (obj.all_awardings) {
        obj.all_awardings.forEach((award, i) => {
          if (i > 3) {
            awardsCount += award.count;
          } else {
            const icon = elementFactory("img", "awards-icon");
            const count = elementFactory("p");
            const iconUrl = award.icon_url;

            icon.src = iconUrl;

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
    const content = elementFactory("p");
    const footerExtras = (() => {
      const footerContainer = elementFactory("div", "card-footer");
      const score = (() => {
        const scoreContainer = elementFactory("div", "score-container-popup comments");
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
      const content = [{ type: "Reply", icon: "fa-regular fa-message" }, { type: "Share" }, { type: "Report" }, { type: "Save" }, { type: "Tip", icon: "fa-solid fa-hand-holding-dollar" }, { type: "Follow" }];

      footerContainer.appendChild(score);

      content.forEach((el) => {
        const containerIcons = elementFactory("div", "footer-icons");
        const button = elementFactory("button");
        if (el.icon) {
          const icon = elementFactory("i", el.icon);
          containerIcons.appendChild(icon);
        }

        button.innerText = el.type;

        containerIcons.appendChild(button);
        footerContainer.appendChild(containerIcons);
      });

      return footerContainer;
    })();

    content.innerText = obj.body;

    container.appendChild(header);
    container.appendChild(content);
    container.appendChild(footerExtras);

    output.appendChild(container);
  }

  document.querySelector("#feed-card-container").classList.toggle("display-none");

  const popUpContainer = elementFactory("div", "clicked-container");
  const popUpContentContainer = elementFactory("div", "clicked");
  const popCard = elementFactory("div", "pop-up-card-container");
  const headerContainer = elementFactory("div", "pop-up-header");

  popUpContentContainer.appendChild(headerContainer);
  popUpContentContainer.appendChild(popCard);

  popUpContainer.appendChild(popUpContentContainer);
  document.querySelector("#feed").appendChild(popUpContainer);

  let postData = await fetch(`https://www.reddit.com/${id}/.json`);
  postData = await postData.json();
  postData = {
    post: postData[0].data.children[0].data,
    comments: postData[1].data.children,
  };

  const score = (() => {
    const scoreContainer = elementFactory("div", "score-container-popup");
    const score = elementFactory("p");
    const scoreValue = formatter(postData.post.score);
    const arrUp = elementFactory("i", "fa-solid fa-arrow-up");
    const arrDown = elementFactory("i", "fa-solid fa-arrow-down");

    score.textContent = scoreValue;

    scoreContainer.appendChild(arrUp);
    scoreContainer.appendChild(score);
    scoreContainer.appendChild(arrDown);

    return scoreContainer;
  })();

  const title = elementFactory("h3");
  const close = elementFactory("button", "pop-close");
  const closeIcon = elementFactory("i", "fa-solid fa-x");
  const closeText = elementFactory("p");

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

  document.querySelector(".clicked-container").addEventListener("click", (e) => {
    let targetContainer = e.target;
    let mainContainerId = null;

    if (e.target.className !== ".clicked-container") {
      while (targetContainer.className !== "card-popped") {
        targetContainer = targetContainer.parentNode;
      }

      mainContainerId = targetContainer.id;

      if (e.target.id.match("user/")) {
        // fetches only comments by user, not gonna implement atm
      } else if (e.target.id.match("r/")) {
        (async () => {
          const subreddit = document.createElement("h1");
          let obj = await fetch(`https://www.reddit.com/${e.target.id}/.json?limit=25`);
          obj = await obj.json();

          subreddit.innerText = `Welcome to ${e.target.id}!`;

          document.querySelector(".clicked-container").remove();
          document.querySelector("#feed-card-container").classList.toggle("display-none");
          document.querySelector("#feed-card-container").innerHTML = "";

          document.querySelector("#feed-card-container").appendChild(subreddit);

          obj.data.children.forEach((obj) => {
            createFeed(obj.data, "#feed-card-container");
          });
        })();
      } else if (e.target.id.match("more!")) {
        (async () => {
          let obj = await fetch(`https://www.reddit.com/${mainContainerId}/.json`);
          obj = await obj.json();

          obj = obj[0].data.children[0].data;
          const author = elementFactory("a");
          const subreddit = elementFactory("a");
          const posted = elementFactory("p");
          const time = elementFactory("p");
          const infoHeaderContainer = elementFactory("div", "sub-auth");
          let timePosted = msToTime(new Date() - new Date(obj.created * 1000));

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
            const icon = elementFactory("img", "awards-icon");
            const count = elementFactory("p");
            const iconUrl = award.icon_url;

            icon.src = iconUrl;

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
      }
    } else if ((e.target.className = ".clicked-container")) {
      document.querySelector(".clicked-container").remove();
      document.querySelector("#feed-card-container").classList.toggle("display-none");
    }
  });
}
