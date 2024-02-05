import { Application } from "./deps.js";
import submissionRouter from "./routers/submissionRouter.js";
import sseRouter from "./routers/sseRouter.js";

const app = new Application();

app.use(async ({ request, state }, next) => {
  const auth = request.headers.get("Authorization");
  state.user = auth;
  await next();
});

app.use(submissionRouter.routes());
app.use(sseRouter.routes());

await app.listen({ port: 7777, hostname: "0.0.0.0" });