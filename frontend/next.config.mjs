/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://openlibrary-api-t91i.onrender.co/api/:path*', // Proxy to Backend
            },
        ]
    },
};

export default nextConfig;
