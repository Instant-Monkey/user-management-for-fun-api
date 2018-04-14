var express = require('express');
var router = express.Router();

var neo4j = require('../controllers/neo4jController.js');
var helpers = require('../lib/helpers');

router.get('/', (req, res) => {
  const fetchedOrganization = neo4j.getAllFromLabel('Organization');
  fetchedOrganization.then(data => {
    res.json(helpers.getNodeArray(data.records));
  }
  ).catch(err => res.json({error: err}));
});

router.post('/new', (req, res) => {
  const properties = req.body;
  const newOrganization = neo4j.createNode('Organization', properties);
  newOrganization.then(data => {
    res.json(helpers.getNodeField(data));
  }
).catch(err => res.json({error: err}));
});

router.get('/:id', (req, res) => {
  const fetchedOrganization = neo4j.getIdFromLabel('Organization', req.params.id);
  fetchedOrganization.then(data => {
    res.json(helpers.getNodeField(data));
  }
  ).catch(err => res.json({error: err}));
});

module.exports = router;