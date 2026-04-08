# Node.js Application Dockerization

## Build the Docker Image
```sh
docker build -t my-node-app .
```

## Run the Docker Container
```sh
docker run -p 3000:3000 my-node-app
```

## Environment Variables
- You can set the `PORT` environment variable to configure the application port. Default is `3000`.

Example:
```sh
docker run -p 8080:8080 -e PORT=8080 my-node-app
```