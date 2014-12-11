/**
 * @file Defines the provider settings.
 *
 * Will set the path to Mongo, and applications id
 * Most of the configuration can be done using system environment variables.
 */

// Load environment variables from .env file
var dotenv = require('dotenv');
dotenv.load();

// node_env can either be "development" or "production"
var node_env = process.env.NODE_ENV || "development";

// Port to run the app on. 8000 for development
// (Vagrant syncs this port)
// 80 for production
var default_port = 8000;
if(node_env === "production") {
  default_port = 80;
}

// Exports configuration for use by app.js
module.exports = {
  env: nodeEnv,
  port: process.env.PORT || defaultPort,

  usersConcurrency: process.env.USERS_CONCURRENCY || 1,
  concurrency: process.env.CONCURRENCY || 1,

  // Optional params

  connect_url: process.env.LOCAL_CONNECT_URL, // Callback URI for anyfetch
  anyfetch_id: process.env.LOCAL_ANYFETCH_ID,
  anyfetch_secret: process.env.LOCAL_ANYFETCH_SECRET,
};
