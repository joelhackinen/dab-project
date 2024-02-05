import { Application, createClient } from "./deps.js";
import submissionRouter from "./routers/submissionRouter.js";

export const client = createClient({
  url: "redis://redis:6379",
  pingInterval: 1000,
});

await client.connect();

const app = new Application();

app.use(async ({ request, state }, next) => {
  const auth = request.headers.get("Authorization");
  state.user = auth;
  await next();
});

app.use(submissionRouter.routes());

await app.listen({ port: 7777, hostname: "0.0.0.0" });