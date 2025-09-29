# syntax=docker/dockerfile:1

FROM node:lts-alpine
WORKDIR /app
COPY . .
RUN npm i
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
EXPOSE 5173
