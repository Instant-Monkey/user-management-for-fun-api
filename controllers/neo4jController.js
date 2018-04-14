const neo4j = require('../node_modules/neo4j-driver/lib/index.js').v1;

const config = require('../config.js');

const modelManager = require('../models/modelManager');
const driver = neo4j.driver(config.neo4jCredentials.url, neo4j.auth.basic(config.neo4jCredentials.user, config.neo4jCredentials.pwd));

driver.onError = error => {
  console.log('couldnt connect to database', error);
};

driver.onCompleted = () => {
  console.log(`connected to database : ${config.neo4jCredentials.url}`);
};

module.exports = {
  getAllFromLabel: (label) => {
    const session = driver.session();
    const resultPromise = session.run(
      `MATCH (n:${label})
      RETURN n`
    );
    resultPromise.then(result => {
      session.close();
    });
    return resultPromise;
  },
  createNode: (label, properties) => {
    const session = driver.session();
    const node = modelManager.createModel(label, properties);
    const resultPromise = session.run(
      `CREATE (a:${label}
        {${node.query}
         }) RETURN a`,
      node.model
    );
    resultPromise.then(result => {
      session.close();
    });
    return resultPromise;
  },
  getIdFromLabel: (label, id) => {
    const session = driver.session();
    const resultPromise = session.run(
      `MATCH (n:${label})
      WHERE id(n) = ${id}
      RETURN n`
    );
    resultPromise.then(result => {
      session.close();
    });
    return resultPromise;
  },
  getOutgoingNodes: (id) => {
    const session = driver.session();
    const resultPromise = session.run(
      `MATCH(n)-->(related)
      WHERE id(n) = ${id}
      RETURN related
      `
    );
    resultPromise.then(result => {
      session.close();
    });
    return resultPromise;
  },
  getIngoingNodes: (id) => {
    const session = driver.session();
    const resultPromise = session.run(
      `MATCH(n)<--(related)
      WHERE id(n) = ${id}
      RETURN related
      `
    );
    resultPromise.then(result => {
      session.close();
    });
    return resultPromise;
  },
  createRelationship: (source, target, REL_TYPE) => {
    const session = driver.session();
    const resultPromise = session.run(
      `MATCH (a),(b)
      WHERE id(a) = ${source} AND id(b) = ${target}
      CREATE (a)-[r:${REL_TYPE}]->(b)
      RETURN r`
    );
    resultPromise.then(result => {
      session.close();
    });
    return resultPromise;
  },
  // for tests
  resetLabel: (label) => {
    const session = driver.session();
    const resultPromise = session.run(`MATCH (n:${label}) DETACH DELETE n`);
    resultPromise.then(result => session.close());
    return resultPromise;
  }
}
