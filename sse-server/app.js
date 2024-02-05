import { Router, Application } from "./deps.js";

const clients = new Map();

const app = new Application();
const router = new Router();

const deleteClient = (client, debug="") => {
  for (const [key, value] of clients.entries()) {
    if (value == client) {
      console.log(debug);
      clients.delete(key);
      break;
    }
  }
};

router.get("/", (ctx) => {
  const user = ctx.request.url.searchParams.get("user");
  const target = ctx.sendEvents();

  clients.delete(user);
  clients.set(user, target);

  target.addEventListener("close", () => {
    deleteClient(target, "del");
    console.log("Connection closed");
  });
  
  target.dispatchMessage({ hello: "world" });
});

router.get("/ping", (ctx) => {
  const target = clients.get("2e7ab60c-ff25-42b0-8416-574e3e4096de");
  target.dispatchMessage({ hello: "MORORORORO" });
  return ctx.response.status = 200;
});

app.use(router.routes());

await app.listen({ port: 4000, hostname: "0.0.0.0" });