module.exports = {
  apps: [
    {
      name: "library-management-api",
      script: "manage.py",
      args: ["runserver"],
      exec_mode: "fork",
      interpreter: "python",
      watch: false,
      instances: 1,
      autorestart: true,
      env: {
        ENV: "development", //development or production
        SECRET_KEY: "",
        DB_ENGINE: "django.db.backends.postgresql",
        DB_NAME: "library_management",
        DB_USER: "postgres",
        DB_PWD: "",
        DB_HOST: "localhost",
        DB_PORT: 5432,
        //DB_SSLMODE:true
      },
    },
  ],
};
