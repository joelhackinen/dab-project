import { Router, Application, ServerSentEvent } from "./deps.js";

const clients = new Map();

const app = new Application();
const router = new Router();


const worker = new Worker(import.meta.resolve("./worker.js"), { type: "module" });
worker.postMessage("Start");

worker.onmessage = (event) => {
  const data = {
    user: event.data.user,
    code: event.data.code,
    feedback: event.data.feedback,
  };
  const target = clients.get(data.user);
  target.dispatchMessage(data);
};

router.get("/", (ctx) => {
  const user = ctx.request.url.searchParams.get("user");
  const target = ctx.sendEvents();

  clients.delete(user);
  clients.set(user, target);
  console.log("Client connected")

  target.addEventListener("close", () => {
    clients.delete(user);
    console.log("Connection closed");
  });
  target.dispatchComment("hello");
});


app.use(router.routes());

await app.listen({ port: 4000, hostname: "0.0.0.0" });