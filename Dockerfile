# install dependecies
FROM node:12.16.0 as dependencies
WORKDIR /usr/src/app
COPY package.json ./
RUN yarn

# build
FROM node:12.16.0 as build
WORKDIR /usr/src/app
COPY --from=dependencies /usr/src/app ./
COPY . ./
RUN echo "BUILDING:"
RUN /usr/src/app/node_modules/typescript/bin/tsc -p tsconfig.build.json
EXPOSE 3000
CMD ["node", "dist/main.js"]