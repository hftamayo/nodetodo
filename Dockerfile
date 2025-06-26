ARG NODE_VERSION=20.11-alpine
FROM node:${NODE_VERSION}

LABEL maintainer="hftamayo" \                                                                        
      version="0.1.4" \ 
      description="Node Todo API"  

#set the timezone to Central Time (CST)
ENV TZ=America/Chicago
RUN apk add --no-cache tzdata && \
    cp "/usr/share/zoneinfo/$TZ" /etc/localtime && \
    echo "$TZ" > /etc/timezone && \
    apk del tzdata

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
