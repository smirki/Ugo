FROM node:14
WORKDIR /app
COPY ./node_websockets/package*.json /app/
RUN npm install
COPY ./node_websockets /app
CMD ["node", "driverMatching.js"]
