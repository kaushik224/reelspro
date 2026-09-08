import type { NextConfig } from "next";

const frontendUrl =
    process.env.FRONTEND_URL || "http://localhost:5173";

const nextConfig: NextConfig = {
    async headers() {
        return [
            {
                source: "/api/:path*",
                headers: [
                    {
                        key: "Access-Control-Allow-Origin",
                        value: frontendUrl,
                    },
                    {
                        key: "Access-Control-Allow-Credentials",
                        value: "true",
                    },
                    {
                        key: "Access-Control-Allow-Methods",
                        value: "GET, POST, PUT, DELETE, OPTIONS",
                    },
                    {
                        key: "Access-Control-Allow-Headers",
                        value: "Content-Type, Authorization",
                    },
                    {
                        key: "Vary",
                        value: "Origin",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;