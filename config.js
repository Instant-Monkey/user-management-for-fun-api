if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

const config = {
  port: process.env.PORT,
  neo4jCredentials: {
    url: process.env.GRAPHENEDB_BOLT_URL,
    user: process.env.GRAPHENEDB_BOLT_USER,
    pwd: process.env.GRAPHENEDB_BOLT_PASSWORD,
  }
}

module.exports = config;
