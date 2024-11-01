FROM node:22-alpine as base

WORKDIR /app

FROM base AS dependencies
COPY package*.json ./

RUN npm ci --legacy-peer-deps
COPY . .

FROM dependencies AS builder-backend
RUN npx nx build backend

FROM base AS pre-runner-backend
COPY --from=builder-backend /app/dist/apps/backend .

RUN npm ci --omit=dev --legacy-peer-deps

FROM base AS runner-backend
COPY --from=pre-runner-backend /app .

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "main.js"] 
