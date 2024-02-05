import { Router } from "../deps.js";

const clients = new Set();

const router = new Router();

router.get("/sse", async (ctx) => {
  const target = ctx.sendEvents();
  target.addEventListener("close", (evt) => {
    clients.delete(target);
  });
  target.dispatchMessage({ hello: "world" });
});

export default router;