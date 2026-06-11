# Stage 1: Build
FROM node:20.19-alpine AS build
WORKDIR /app

# Cuando se despliega en Docker con nginx como proxy, la URL es relativa (/api/v1).
# Para desarrollo local directo usa: http://localhost:8090/api/v1
ARG VITE_API_URL=/api/v1
ARG VITE_API_TIMEOUT=30000
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_API_TIMEOUT=$VITE_API_TIMEOUT

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production (versión fija para evitar descargas inesperadas)
FROM nginx:1.27-alpine

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
