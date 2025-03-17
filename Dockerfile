FROM node:alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 8003

CMD ["npm", "start"]
#how to run this file:
#docker build -t hftamayo/nodetodo:<branch>-<#>.<#>.<#> .
#docker run --name nodetodo -p 127.0.0.1:<port>:<port> -d --env-file .env hftamayo/nodetodo:<branch>-<#>.<#>.<#>
