const config = {
  development: {
    apiUrl: "http://localhost:3000/api",
    socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000",
    frontendUrl: process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000",
  },
  production: {
    apiUrl: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api`,
    socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL,
    frontendUrl: process.env.NEXT_PUBLIC_FRONTEND_URL,
  },
}

const environment = process.env.NODE_ENV || "development"

export default config[environment as keyof typeof config]

