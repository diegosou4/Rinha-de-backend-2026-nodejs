FROM node:22-alpine

WORKDIR /app



COPY package.json package-lock.json ./
COPY dist/ ./dist/
COPY resources/ ./resources/
COPY node_modules/ ./node_modules/

CMD ["npm", "start"]