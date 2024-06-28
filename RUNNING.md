## Create the grader-image
- The base grader image can be built using either the `build.sh` command or the `docker build -t grader-image .` command in the `grader-image` folder

## Run in production:
- `docker compose -f docker-compose.prod.yml up -d --build` exposes the application to localhost:7800
- `docker compose down` to shut it down

## Run in development:
- `npm prefix ./programming-ui install`
- `docker compose up -d --build` exposes the application to localhost:7800
- `docker compose run --rm --entrypoint=npx playwright playwright test` to run the tests
- `docker compose down` to shut it down