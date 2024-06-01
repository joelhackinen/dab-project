## Run in production:
- `docker compose -f docker-compose.prod.yml up -d --build` exposes the application to localhost:7800
- `docker compose down` to shut it down

## Run in development:
- `docker compose up -d --build` exposes the application to localhost:7800
- `docker compose run --rm --entrypoint=npx playwright playwright test`
- `docker compose down` to shut it down