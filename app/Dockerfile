# Stage 1 — build the app
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
# The --host flag is MANDATORY for Docker to work with Vite
CMD ["npm", "run", "dev", "--", "--host"]

# Stage 2 — serve with Nginx
# FROM nginx:alpine
# COPY --from=builder /app/dist /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# EXPOSE 80