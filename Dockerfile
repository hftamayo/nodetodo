ARG NODE_VERSION=20.11-alpine
FROM node:${NODE_VERSION}

LABEL maintainer="hftamayo" \                                                                        
      version="0.1.3" \ 
      description="Node Todo API"  

WORKDIR /app

RUN apk add --no-cache \
    bash \
    git \
    jq \
    make

COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 8021

CMD ["npm", "start"]
#how to run this file:
#docker build --no-cache --platform linux/amd64 -t hftamayo/nodetodo:<#>.<#>.<#>-<branch> .
#docker run --name nodetodo -p <port>:<port> -d --env-file .env hftamayo/nodetodo:<#>.<#>.<#>-<branch>
