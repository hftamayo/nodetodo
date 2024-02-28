import {startApp} from './src/app';

startApp()
.then(() => {
    console.log("Nodetodo backend is up and ready")
})
.catch((error: any) => {
    console.error("Error starting Nodetodo backend: ", error);
    process.exit(1);
});