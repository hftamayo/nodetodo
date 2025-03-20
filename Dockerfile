FROM node:20.11-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 8021

CMD ["npm", "start"]
#how to run this file:
#docker build --no-cache --platform linux/amd64 -t hftamayo/nodetodo:<#>.<#>.<#>-<branch> .
#docker run --name nodetodo -p <port>:<port> -d --env-file .env hftamayo/nodetodo:<#>.<#>.<#>-<branch>
