var express = require('express');
var router = express.Router();

var neo4j = require('../controllers/neo4jController.js');
var helpers = require('../lib/helpers');

router.get('/', (req, res) => {
  const fetchedUser = neo4j.getAllFromLabel('User');
  fetchedUser.then(data => {
    res.json(helpers.getNodeArray(data.records));
  }
  ).catch(err => res.json({error: err}));
});

router.post('/new', (req, res) => {
  const properties = req.body;
  const newUser = neo4j.createNode('User', properties);
  newUser.then(data => {
    res.json(helpers.getNodeField(data));
  }
).catch(err => res.json({error: err}));
});

router.get('/:id', (req, res) => {
  const fetchedUser = neo4j.getIdFromLabel('User', req.params.id);
  fetchedUser.then(data => {
    res.json(helpers.getNodeField(data));
  }
  ).catch(err => res.json({error: err}));
});

router.get('/:id/groups', (req, res) => {
  const users = neo4j.getOutgoingNodes(req.params.id);
  users.then(data => {
    res.json(helpers.getNodeArray(data.records));
  }
  ).catch(err => res.json({error: err}));
});

module.exports = router;
