# Using alpine allows us to have a smaller image of nodejs
FROM alpine

# Defining our workdir in Docker container
WORKDIR /app

RUN apk add npm

# Copy package.json and running npm install after to save space
COPY package.json .

RUN npm install

# Copy remaining source files over to the working directory
COPY . . 

# Create a non-root user and set the current user (named 'default')
RUN addgroup -S nonroot && adduser -S default -G nonroot 

USER default

CMD ["npm", "start"]