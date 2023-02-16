FROM node:18-alpine as base
WORKDIR /app

FROM base as prod-deps
COPY package.json package-lock.json /app/
COPY ./packages /app/packages
RUN npm install
RUN npm run build --workspaces

ARG TARGET_SERVICE
COPY ./services/${TARGET_SERVICE}/package.json ./services/${TARGET_SERVICE}/package-lock.json /app/services/${TARGET_SERVICE}/
WORKDIR /app/services/${TARGET_SERVICE}
RUN npm install --omit=dev

FROM prod-deps as dev-deps
RUN npm install

FROM dev-deps as assets
ARG TARGET_SERVICE
COPY ./services/${TARGET_SERVICE} /app/services/${TARGET_SERVICE}
RUN npm run build
RUN rm -rf node_modules

FROM prod-deps
ARG TARGET_SERVICE
COPY --from=assets /app/services/${TARGET_SERVICE} /app/services/
WORKDIR /app/services/${TARGET_SERVICE}
CMD npm run start
