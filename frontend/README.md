# Frontend for Task Management App

This is the frontend part of the Task Management App, built with React, TanStack Query, TanStack Router, and Tailwind CSS v4.

## Tailwind CSS v4 Configuration

This project uses Tailwind CSS v4, which has different configuration requirements compared to v3:

1. PostCSS plugin has moved to a separate package:
   ```
   npm install -D @tailwindcss/postcss
   ```

2. The PostCSS configuration uses `@tailwindcss/postcss` instead of `tailwindcss`:
   ```js
   // postcss.config.js
   module.exports = {
     plugins: {
       "@tailwindcss/postcss": {},
       autoprefixer: {},
     },
   }
   ```

3. CSS import syntax has changed:
   ```css
   /* Old v3 syntax */
   /* @tailwind base;
   @tailwind components;
   @tailwind utilities; */

   /* New v4 syntax */
   @import "tailwindcss";
   ```

4. For Vite integration, the `@tailwindcss/vite` plugin is required:
   ```
   npm install -D @tailwindcss/vite
   ```

5. Package.json needs `"type": "module"` for ESM compatibility.

## Running the Application

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at http://localhost:5173 (or another port if 5173 is already in use).

## Docker Deployment

The application includes Docker support for easy deployment in any environment.

### Using Docker Compose (Full Stack)

To run both frontend and backend together:

```bash
# From the frontend directory
docker-compose up -d
```

This will:
1. Build the frontend and package it with Nginx
2. Connect to the backend service
3. Set up the necessary network configuration
4. Expose the application on port 80

### Using Docker Separately (Frontend Only)

To build and run just the frontend container:

```bash
# Build the image
docker build -t task-management-frontend .

# Run the container
docker run -p 80:80 task-management-frontend
```

### Configuration

The Nginx configuration in `nginx.conf` handles:
- Serving the static React application
- Routing all API requests to the backend
- SPA routing support (fallback to index.html)
- Asset caching and compression

To modify the backend API URL, edit the `nginx.conf` file before building. 