# Node.js Application

## Build and Run Instructions

### Build the Docker Image
```bash
docker build -t node-app .
```

### Run the Docker Container
```bash
docker run -p 3000:3000 node-app
```

### Set a Custom Port
You can set a custom port by passing the `PORT` environment variable:
```bash
docker run -p 8080:8080 -e PORT=8080 node-app
```

The application will be accessible at `http://localhost:3000` (or the custom port you set).