import {
  Router,
  Application,
  ServerSentEvent,
  ServerSentEventTarget
} from "./deps.ts";

import {
  ProgrammingAssignmentSubmission
} from "./types.ts";

const clients = new Map<string, ServerSentEventTarget>();

const app = new Application();
const router = new Router();

const worker = new Worker(import.meta.resolve("./worker.ts"), { type: "module" });
worker.postMessage("Start");

worker.onmessage = ({ data }: MessageEvent<ProgrammingAssignmentSubmission>) => {
  const target = clients.get(data.user_uuid);
  const e = new ServerSentEvent("result", { data });
  target?.dispatchEvent(e);
};

router.get("/", (ctx) => {
  const user = ctx.request.url.searchParams.get("user");

  if (!user) {
    return ctx.response.status = 400;
  }

  const target = ctx.sendEvents({ keepAlive: true });

  clients.delete(user);
  clients.set(user, target);
  console.log("Client connected")

  target.addEventListener("close", () => {
    clients.delete(user);
    console.log("Connection closed");
  });

  const e = new ServerSentEvent("init", { data: "hello from server" });

  target.dispatchEvent(e);
});


app.use(router.routes());

await app.listen({ port: 4000, hostname: "0.0.0.0" });