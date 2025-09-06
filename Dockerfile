FROM ghcr.io/puppeteer/puppeteer

WORKDIR /app

COPY package.json .

RUN npm install 

RUN mkdir -p uploads

COPY . .

CMD ["npx","pm2-runtime", "start", "ecosystem.config.js"]
