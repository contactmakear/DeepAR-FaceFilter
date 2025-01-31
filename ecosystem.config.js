// ecosystem.config.js
module.exports = {
    apps: [
      {
        name: "Prod-1",
        script: "/home/social/public_html/db.js",
        env: {
          PORT: 8081, // Set the port for this instance
        },
      },
      {
        name: "Prod-2",
        script: "/home/social/public_html/db.js",
        env: {
          PORT: 8082, // Set the port for this instance
        },
      },
      {
        name: "Prod-3",
        script: "/home/social/public_html/db.js",
        env: {
          PORT: 8083, // Set the port for this instance
        },
      },
      {
        name: "Prod-4",
        script: "/home/social/public_html/db.js",
        env: {
          PORT: 8084, // Set the port for this instance
        },
      },
      {
        name: "Prod-5",
        script: "/home/social/public_html/db.js",
        env: {
          PORT: 8085, // Set the port for this instance
        },
      },
    ],
  };
  