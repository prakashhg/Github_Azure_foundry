# Node.js Application Dockerization

## Build the Docker Image
```sh
docker build -t my-node-app .
```

## Run the Docker Container
```sh
docker run -p 3000:3000 -e PORT=3000 my-node-app
```

## Environment Variables
- `PORT`: The port on which the application runs (default: 3000).

Ensure you have the necessary files and dependencies before building the Docker image.