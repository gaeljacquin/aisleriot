FROM node:26-bookworm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    python3 \
    make \
    g++ \
    procps \
    zoxide \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm (matching package.json version), @antfu/ni, and other packages such as @google/gemini-cli
RUN npm install -g pnpm@11.1.2 @antfu/ni @google/gemini-cli

# Initialize zoxide for bash
RUN echo 'eval "$(zoxide init bash)"' >> ~/.bashrc

# Install Go (latest stable)
RUN ARCH=$(dpkg --print-architecture) && \
    GO_VERSION=$(curl -fsSL "https://go.dev/dl/?mode=json" | grep -o '"go[0-9.]*"' | head -1 | tr -d '"') && \
    curl -fsSL "https://go.dev/dl/${GO_VERSION}.linux-${ARCH}.tar.gz" | tar -C /usr/local -xz
ENV PATH="/usr/local/go/bin:${PATH}"
RUN echo 'export PATH="/usr/local/go/bin:$PATH"' >> ~/.bashrc

WORKDIR /workspaces/aisleriot
