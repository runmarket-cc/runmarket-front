/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        unoptimized: true,
    },
    async redirects() {
        return [
            {
                source: '/terms',
                destination: 'https://api.runmarket.cc/terms',
                permanent: false,
            },
            {
                source: '/privacy',
                destination: 'https://api.runmarket.cc/privacy',
                permanent: false,
            },
        ]
    },
}

export default nextConfig
