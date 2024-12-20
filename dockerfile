ARG NODE_VERSION=20.18.0

FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /usr/src/app
EXPOSE 8000
COPY tsconfig.json .

FROM base AS dev

# Copy the entire project directory except what's ignored in .dockerignore
COPY . .

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev

USER node

# Development command
CMD ["npm", "run", "dev"]

FROM base AS prod

# Copy the application code
COPY . .

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# Switch to non-root user
USER node

# Run build command
RUN npm run build

# Production command to start the application
CMD ["npm", "run", "serve"]