import nextConfig from 'eslint-config-next';

const config = [
    ...nextConfig,
    { ignores: ['src/client/**'] },
    {
        rules: {
            'react-hooks/immutability': 'warn',
            'react-hooks/purity': 'warn',
            'react-hooks/set-state-in-effect': 'warn',
        },
    },
];

export default config;
