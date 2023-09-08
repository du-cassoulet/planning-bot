import "dotenv/config";
import Client from "./classes/Client";

const client = new Client();

client.start(process.env.TOKEN);
