FROM node:18-slim

RUN apt-get update && \
    apt-get install -y ffmpeg python3 python3-pip python3-venv make g++ && \
    python3 -m venv /opt/venv && \
    /opt/venv/bin/pip install --upgrade pip && \
    /opt/venv/bin/pip install yt-dlp && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

ENV PATH="/opt/venv/bin:$PATH"

WORKDIR /src

RUN corepack enable

COPY package*.json ./

RUN npm install --no-frozen-lockfile

COPY . .

CMD ["npm", "start"]
