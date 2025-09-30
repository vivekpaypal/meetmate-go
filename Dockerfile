# Multi-stage build
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM golang:1.23-alpine AS backend-build
RUN apk add --no-cache gcc musl-dev sqlite-dev
WORKDIR /app
COPY backend/go.mod backend/go.sum ./
RUN go mod download
COPY backend/ ./
RUN go mod tidy
RUN CGO_ENABLED=1 GOOS=linux go build -o server ./cmd/server
RUN ls -la ./server

FROM alpine:latest
RUN apk --no-cache add ca-certificates sqlite
WORKDIR /root/
COPY --from=backend-build /app/server .
COPY --from=backend-build /app/migrations ./backend/migrations
COPY --from=frontend-build /app/frontend/dist ./frontend/dist
RUN chmod +x ./server
RUN ls -la ./server
EXPOSE 8080
CMD ["./server"]
