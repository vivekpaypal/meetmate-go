# Multi-stage build
FROM docker.appdirect.tools/node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM docker.appdirect.tools/golang:1.21-alpine AS backend-build
WORKDIR /app
COPY backend/go.mod backend/go.sum ./
RUN go mod download
COPY backend/ ./
RUN go mod tidy
RUN CGO_ENABLED=0 GOOS=linux go build -o server ./cmd/server

FROM docker.appdirect.tools/alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=backend-build /app/server .
COPY --from=backend-build /app/migrations ./backend/migrations
COPY --from=frontend-build /app/frontend/dist ./frontend/dist
EXPOSE 8080
CMD ["./server"]
