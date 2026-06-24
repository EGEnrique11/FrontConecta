# --- Etapa 1: Compilación (Node 20) ---
FROM node:20-alpine AS build
WORKDIR /app

# Copiamos los archivos de dependencias y las instalamos
COPY package*.json ./
RUN npm install

# Copiamos todo el código fuente y compilamos
COPY . .
RUN npm run build -- --configuration=production

# --- Etapa 2: Servidor Web Nginx ---
FROM nginx:alpine

# Copiamos tu archivo de configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# IMPORTANTE: Ruta actualizada con el nombre exacto de tu package.json
COPY --from=build /app/dist/frontend-conecta/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]