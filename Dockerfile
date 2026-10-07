FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_URL=http://localhost:5000/api
ARG VITE_MAX_FILE_MB=8
ENV VITE_API_URL=$VITE_API_URL VITE_MAX_FILE_MB=$VITE_MAX_FILE_MB
RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
