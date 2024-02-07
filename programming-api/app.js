import { Application, createClient } from "./deps.js";
import submissionRouter from "./routers/submissionRouter.js";
import assignmentRouter from "./routers/assignmentRouter.js";

export const client = createClient({
  url: "redis://redis:6379",
  pingInterval: 1000,
});

await client.connect();

const app = new Application();

app.use(async ({ request, state }, next) => {
  state.user = request.headers.get("Authorization");
  await next();
});

app.use(assignmentRouter.routes());
app.use(submissionRouter.routes());

await app.listen({ port: 7777, hostname: "0.0.0.0" });