# -----------------------------------------
# 1) BUILD
# -----------------------------------------
FROM node:20.19.5-alpine AS builder
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias de desarrollo
RUN npm install

# Copiar código fuente
COPY . .

# Generar Prisma Client
RUN npm run prisma:generate

# Compilar NestJS (dist/)
RUN npm run build


# -----------------------------------------
# 2) RUNTIME
# -----------------------------------------
FROM node:20.19.5-alpine
WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar dependencias de producción
RUN npm install --production

# Copiar dist desde build
COPY --from=builder /app/dist ./dist

# Copiar Prisma Client generado
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Cloud Run usa el puerto 8080
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "dist/main.js"]
