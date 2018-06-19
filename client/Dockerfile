# Build image
FROM node:10 as builder
LABEL maintainer="david.morcillo@codegram.com"

# Build arguments
ARG node_env=production

# Environment
ENV APP_HOME /code
ENV NODE_ENV $node_env
ENV HOST 0.0.0.0

# Install local dependencies
ADD package.json /tmp/package.json
ADD package-lock.json /tmp/package-lock.json
RUN cd /tmp && npm i && mkdir -p $APP_HOME && \
    cp -a /tmp/node_modules $APP_HOME

# Add source code
ADD . $APP_HOME

# Run the development server
CMD cd /code && npm run serve
