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
- `PORT`: The port the application will run on (default: 3000).