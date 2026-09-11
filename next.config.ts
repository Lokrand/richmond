import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: '50mb',
        },
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'richmond-s3.akorz.duckdns.org',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
