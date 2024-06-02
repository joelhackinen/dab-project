The application contains six different services:
  1. redis
    - utilized for:
      - caching database queries
      - nonblocking asynchronous communication between services with Redis Streams
  2. grader-api
    - consumes messages from `submissions` stream and grades the submissions
    - once a submission has been graded, it publishes a new entry to `results` stream
  3. sse-server
    - acts as a consumer to `results` stream, sends updates to clients with Server Sent Events and updates the database
    - utilizes web worker API to listen for requests to form a SSE connection and to consume a Redis stream simultaneously
  4. programming-ui
    - implemented with Astro and Svelte
    - serves the user interface to the client
    - forms a SSE-connection with `sse-server` that updates the submissions' statuses in a way that the clients don't need to poll for updates
  5. programming-api
    - fetches the assignments from the database for clients to use
    - accepts new submissions and publishes new entries to `submissions` stream
  6. nginx
    - reverse proxy and load balancer
