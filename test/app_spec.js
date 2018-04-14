var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();
var helpers = require('../lib/helpers');

var neo4j = require('../controllers/neo4jController.js');

chai.use(chaiHttp);


describe('User', () => {
    var dummyId;
    beforeEach(done => {
      const reset = neo4j.resetLabel('User');
      const newUser = neo4j.createNode('User', {
        name: 'Test User',
        email: 'test_user@gmail.com'
      });

      Promise.all([reset,newUser]).then(data => {
        dummyId = helpers.getNodeField(data[1]).identity.low;
        done();
      });
    });

    it('should add a SINGLE User on users/new POST', (done) => {
      chai.request(server)
        .post('/users/new')
        .send({
          name: 'Sylvain Laugier',
          email: 'slaugier@gmail.com'
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.labels[0].should.equal('User');
          res.body.properties.should.have.property('name');
          res.body.properties.name.should.equal('Sylvain Laugier');
          res.body.properties.should.have.property('email');
          res.body.properties.email.should.equal('slaugier@gmail.com');
          done();
        });
    });

    it('should get a SINGLE User on users/:id GET', (done) => {
      chai.request(server)
        .get(`/users/${dummyId}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.labels[0].should.equal('User');
          res.body.properties.should.have.property('name');
          res.body.properties.name.should.equal('Test User');
          res.body.properties.should.have.property('email');
          res.body.properties.email.should.equal('test_user@gmail.com');
          done();
        });
    });

    it('should get Many Users on users GET', (done) => {
      const newUser = neo4j.createNode('User', {
        name: 'Test User2',
        email: 'test_user2@gmail.com'
      });

      newUser.then(data => {
        chai.request(server)
          .get(`/users/`)
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');
            res.body[0].labels[0].should.equal('User');
            res.body[0].properties.email.should.equal('test_user@gmail.com');
            res.body[1].labels[0].should.equal('User');
            res.body[1].properties.email.should.equal('test_user2@gmail.com');
            done();
          });
      });
    });

});

describe('Organization', () => {
    var dummyId;
    beforeEach(done => {
      const reset = neo4j.resetLabel('Organization');
      const newOrganization = neo4j.createNode('Organization', {
        name: 'Yutani',
      });

      Promise.all([reset,newOrganization]).then(data => {
        dummyId = helpers.getNodeField(data[1]).identity.low;
        done();
      });
    });

    it('should add a SINGLE Organization on organizations/new POST', (done) => {
      chai.request(server)
        .post('/organizations/new')
        .send({
          name: 'Weyland',
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.labels[0].should.equal('Organization');
          res.body.properties.should.have.property('name');
          res.body.properties.name.should.equal('Weyland');
          done();
        });
    });

    it('should get a SINGLE Organization on organizations/:id GET', (done) => {
      chai.request(server)
        .get(`/organizations/${dummyId}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.labels[0].should.equal('Organization');
          res.body.properties.should.have.property('name');
          res.body.properties.name.should.equal('Yutani');
          done();
        });
    });

    it('should get many Organization on organizations GET', (done) => {
      const newOrganization = neo4j.createNode('Organization', {
        name: 'Weyland',
      });

      newOrganization.then(data => {
        chai.request(server)
          .get(`/organizations/`)
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');
            res.body[0].labels[0].should.equal('Organization');
            res.body[0].properties.name.should.equal('Yutani');
            res.body[1].labels[0].should.equal('Organization');
            res.body[1].properties.name.should.equal('Weyland');
            done();
          });
      });
    });

});
