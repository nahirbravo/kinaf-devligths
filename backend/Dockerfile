FROM node:18-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer puerto
EXPOSE 5000

# Comando para desarrollo (con nodemon si lo tienes)
CMD ["npm", "run", "dev"]