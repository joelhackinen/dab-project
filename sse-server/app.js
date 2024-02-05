import { Router, Application, ServerSentEvent } from "./deps.js";

const clients = new Map();

const app = new Application();
const router = new Router();


const worker = new Worker(import.meta.resolve("./worker.js"), { type: "module" });
worker.postMessage("Start");

worker.onmessage = (event) => {
  const data = {
    user: event.data.user,
    assignment: event.data.assignment,
    code: event.data.code,
    result: event.data.result,
  };
  const target = clients.get(data.user);
  target.dispatchMessage(data);
};

router.get("/", (ctx) => {
  const user = ctx.request.url.searchParams.get("user");
  const target = ctx.sendEvents();

  clients.delete(user);
  clients.set(user, target);

  target.addEventListener("close", () => {
    clients.delete(user);
    console.log("Connection closed");
  });
  
  target.dispatchComment("hello");
});


app.use(router.routes());

await app.listen({ port: 4000, hostname: "0.0.0.0" });