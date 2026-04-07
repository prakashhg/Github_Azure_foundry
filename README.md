# Node.js Application

## Build and Run with Docker

### Build the Docker Image
```bash
docker build -t node-app .
```

### Run the Docker Container
```bash
docker run -p 3000:3000 -e PORT=3000 node-app
```

### Environment Variables
- `PORT`: The port on which the application runs (default: 3000).

### Access the Application
Once the container is running, access the application at `http://localhost:3000`.