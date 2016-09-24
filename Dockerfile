FROM node:4.4

# Create app directory
RUN mkdir -p /code
WORKDIR /code

# Install app dependencies
COPY package.json /code/
RUN npm install
RUN npm cache clean

# Bundle app source
COPY . /code
RUN npm run build
EXPOSE 3001
CMD [ "npm", "run", "serve" ]
