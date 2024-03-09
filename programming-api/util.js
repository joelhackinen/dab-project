import { client as redis } from "./app.js";
import * as assService from "./services/assignmentService.js";
import * as submissionService from "./services/submissionService.js";

const cacheMethodCalls = (object, methodsToFlushCacheWith = []) => {
  const handler = {
    get: (module, methodName) => {
      const method = module[methodName];
      return async (...methodArgs) => {
        if (methodsToFlushCacheWith.includes(methodName)) {
          await redis.flushDb();
          return await method.apply(this, methodArgs);
        }

        const cacheKey = `${methodName}-${JSON.stringify(methodArgs)}`;
        const cacheResult = await redis.get(cacheKey);
        if (!cacheResult) {
          const result = await method.apply(this, methodArgs);
          await redis.set(cacheKey, JSON.stringify(result));
          return result;
        }

        return JSON.parse(cacheResult);
      };
    },
  };

  return new Proxy(object, handler);
};

const assignmentService = cacheMethodCalls(assService, ["addAssignment"]);

export { assignmentService, submissionService };