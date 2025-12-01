module.exports = {
  apps: [
    {
      name: "blog-project",
      script: "dist/src/index.js",
      cwd: "/var/www/blog",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "development",
        PORT: 3000
      },
      env_production: {
        NODE_ENV: "production"
      }
    }
  ]
};
