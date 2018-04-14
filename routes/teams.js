var express = require('express');
var router = express.Router();

var neo4j = require('../controllers/neo4jController.js');
var helpers = require('../lib/helpers');

router.get('/', (req, res) => {
  const fetchedTeams = neo4j.getAllFromLabel('Team');
  fetchedTeams.then(data => {
    res.json(helpers.getNodeArray(data.records));
  }
  ).catch(err => res.json({error: err}));
});

router.post('/new', (req, res) => {
  const properties = req.body;
  const newTeams = neo4j.createNode('Team', properties);
  newTeams.then(data => {
    res.json(helpers.getNodeField(data));
  }
).catch(err => res.json({error: err}));
});

router.get('/:id', (req, res) => {
  const fetchedTeams = neo4j.getIdFromLabel('Team', req.params.id);
  fetchedTeams.then(data => {
    res.json(helpers.getNodeField(data));
  }
  ).catch(err => res.json({error: err}));
});

module.exports = router;
