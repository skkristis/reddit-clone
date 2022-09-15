// fetch("https://www.reddit.com/hot/.json")
//   .then((r) => r.json())
//   .then((r) => {
//     console.log(r);
//     r.data.children.forEach((i) => {
//       try {
//         document.body.appendChild(Object.assign(document.createElement("img"), { src: i.data.thumbnail }));
//       } catch (error) {
//         console.log(error.message);
//       }
//     });
//   });

// fetch("https://www.reddit.com/search/.json?q=javascript")
//   .then((r) => r.json())
//   .then((r) => {
//     console.log(r);
//   });
