const {startApp} = require('./src/app');

startApp()
.then(() => {
    console.log("Nodetodo backend is up and ready")
})
.catch((error) => {
    console.error("Error starting Nodetodo backend: ", error);
    process.exit(1);
});