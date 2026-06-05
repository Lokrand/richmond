import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: '50mb',
        },
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    // api: {
    //     bodyParser: {
    //         sizeLimit: '50mb',
    //     },
    // },
};

export default nextConfig;
