import { Router, Application } from "./deps.js";

const clients = new Map();

const app = new Application();
const router = new Router();


router.get("/", (ctx) => {
  const user = ctx.request.url.searchParams.get("user");
  const target = ctx.sendEvents();

  clients.delete(user);
  clients.set(user, target);

  target.addEventListener("close", () => {
    clients.delete(user);
    console.log("Connection closed");
  });
  
  target.dispatchMessage({ hello: "world" });
});


app.use(router.routes());

await app.listen({ port: 4000, hostname: "0.0.0.0" });