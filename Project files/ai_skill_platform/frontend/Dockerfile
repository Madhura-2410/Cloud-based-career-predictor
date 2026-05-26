FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production runtime
FROM node:18-alpine

WORKDIR /app

ENV REACT_APP_API_URL=https://api.example.com
ENV REACT_APP_AAD_AUTHORITY=https://login.microsoftonline.com/{TENANT_ID}
ENV REACT_APP_AAD_CLIENT_ID={CLIENT_ID}

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/build ./build

RUN npm install -g serve

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/index.html || exit 1

CMD ["serve", "-s", "build", "-l", "3000"]
