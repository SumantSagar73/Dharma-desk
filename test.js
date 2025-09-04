fetch("https://api.nekosapi.com/v4/images/random", {
  method: "GET",
})
  .then((res) => res.json())
  .then((data) => {
    console.log(data[0].url);
    // document.body.style.backgroundImage = `url(${data[0].url})`;
    // document.getElementById("author").textContent = `By: ${data.user.name}`;
  });

//   fetch(
//   "https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=anime"
// )
//   .then((res) => res.json())
//   .then((data) => {
//   })
//   .catch((err) => {
//     // Use a default background image/author
//     document.body.style.backgroundImage = `url(https://images.unsplash.com/photo-1560008511-11c63416e52d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMTEwMjl8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MjI4NDIxMTc&ixlib=rb-1.2.1&q=80&w=1080
// )`;
//     document.getElementById("author").textContent = `By: Dodi Achmad`;
//   });
