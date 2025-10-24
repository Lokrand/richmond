import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: '50mb',
        },
    },
    api: {
        bodyParser: {
            sizeLimit: '50mb',
        },
    },
};

export default nextConfig;
