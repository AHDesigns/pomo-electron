FROM node:16.9.1-alpine

WORKDIR /app

RUN apt-get storeUpdate && \
    apt-get install -y xvfb \
                    libgbm1 \
                    libxss1 \
                    libnss3 \
                    libgtk-3-dev \
                    libasound2-dev \
                    unzip \
                    && rm -rf /var/lib/apt/lists/*

COPY yarn.lock package.json jest.config.js tsconfig.json ./

RUN yarn install

COPY client ./client
COPY electron ./electron
COPY shared ./shared
COPY tooling ./tooling

RUN yarn build

# not needed for the build so can help with caching
COPY e2e ./e2e

RUN NODE_ENV=production xvfb-run --auto-servernum --server-args='-screen 0, 1600x900x24' yarn e2e
