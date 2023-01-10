
import PalmClient from "./PalmClient";

const client = new PalmClient();
client.socketClient.listOfTask.push(() => console.log("oui"))
