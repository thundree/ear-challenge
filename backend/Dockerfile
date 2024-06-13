FROM node:18-slim

WORKDIR /app

# Copiar apenas package.json e yarn.lock
COPY package.json yarn.lock ./

# Instalar dependências
RUN yarn install

COPY src ./src
COPY tsconfig.json ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY .env.production  ./

RUN yarn build:css

EXPOSE 3000

CMD ["yarn", "start"]
