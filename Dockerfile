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

FROM dependencies AS builder-web-app

RUN npx nx export mobile --platform=web

FROM base AS pre-runner-web-app
COPY --from=builder-web-app /app/apps/mobile/dist .
COPY --from=builder-web-app /app/apps/mobile/package.json .

FROM nginx:1.27-alpine as runner-web-app
COPY --from=pre-runner-web-app /app /usr/share/nginx/html
COPY ./apps/mobile/nginx/default.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
