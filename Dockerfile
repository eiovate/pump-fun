# Use official Node.js image with Debian base
FROM node:18-bullseye

# Install Playwright dependencies (fonts, libraries, etc)
RUN apt-get update && apt-get install -y \
  libgtk-4-1 \
  libgraphene-1.0-0 \
  libgstreamer-gl1.0-0 \
  libgstreamer-plugins-base1.0-0 \
  libenchant-2-2 \
  libsecret-1-0 \
  libmanette-0.2-0 \
  libgles2 \
  libnss3 \
  libx11-xcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxrandr2 \
  libgbm1 \
  libasound2 \
  wget \
  ca-certificates \
  fonts-liberation \
  libappindicator3-1 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libatspi2.0-0 \
  libcups2 \
  libdbus-1-3 \
  libdrm2 \
  libexpat1 \
  libfontconfig1 \
  libgbm1 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libpango-1.0-0 \
  libx11-6 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  libxrender1 \
  libxss1 \
  libxtst6 \
  xdg-utils \
  --no-install-recommends && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN yarn install --frozen-lockfile

# Copy the rest of your app files
COPY . .

# Install Playwright browsers
RUN npx playwright install

# Expose port (adjust if needed)
EXPOSE 3000

# Run the app
CMD ["node", "index.js"]
