# Build image
FROM ubuntu
LABEL maintainer="david.morcillo@codegram.com"

# Build arguments
ARG node_env=production

# Environment
ENV APP_HOME /code
ENV NODE_ENV $node_env
ENV REDIS_URL redis://redis:6379/1

# Install global dependencies
RUN apt-get update && \
    apt-get install -y curl python-pip python-dev && \
    pip install tensorflow==1.5

# Install Node.js 10
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash - && \
    apt-get install -y nodejs

# Install local dependencies
ADD package.json /tmp/package.json
ADD package-lock.json /tmp/package-lock.json
RUN cd /tmp && npm i && mkdir -p $APP_HOME && \
    cp -a /tmp/node_modules $APP_HOME

# Add source code
ADD . $APP_HOME

# Add entrypoint script
COPY docker-entrypoint.sh /

ENTRYPOINT ["/bin/sh", "/docker-entrypoint.sh"]
