const {startApp } = require("./app");

startApp()
  .then(() => {
    console.log("Nodetodo backend is up and running");
  })
  .catch((error) => {
    console.log("Error starting Nodetodo backend: ", error);
  });
