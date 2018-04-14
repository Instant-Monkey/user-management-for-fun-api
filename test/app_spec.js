var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();
var helpers = require('../lib/helpers');

var neo4j = require('../controllers/neo4jController.js');

chai.use(chaiHttp);


describe('User', () => {
    var dummyId;
    before(done => {
      const newUser = neo4j.createNode('User', {
        name: 'Test User',
        email: 'test_user@gmail.com'
      });

      newUser.then(data => {
        dummyId = helpers.getNodeField(data).identity.low;
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
      chai.request(server)
        .get(`/users/`)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body[0].labels[0].should.equal('User');
          res.body[1].labels[0].should.equal('User');
          done();
        });
    });

    after(done => {
      const reset = neo4j.resetLabel('User');
      reset.then(() => done());
    })

});

describe('Organization', () => {
    var dummyId;
    before(done => {
      const newOrganization = neo4j.createNode('Organization', {
        name: 'Yutani',
      });

      newOrganization.then(data => {
        dummyId = helpers.getNodeField(data).identity.low;
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
      chai.request(server)
        .get(`/organizations/`)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body[0].labels[0].should.equal('Organization');
          res.body[1].labels[0].should.equal('Organization');
          done();
        });
    });

    after(done => {
      const reset = neo4j.resetLabel('Organization');
      reset.then(() => done());
    })
});

describe('Team', () => {
    var dummyId;
    before(done => {
      const newTeam = neo4j.createNode('Team', {
        name: 'Red',
      });

      newTeam.then(data => {
        dummyId = helpers.getNodeField(data).identity.low;
        done();
      });
    });

    it('should add a SINGLE Team on teams/new POST', (done) => {
      chai.request(server)
        .post('/teams/new')
        .send({
          name: 'Blue',
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.labels[0].should.equal('Team');
          res.body.properties.should.have.property('name');
          res.body.properties.name.should.equal('Blue');
          done();
        });
    });

    it('should get a SINGLE Team on teams/:id GET', (done) => {
      chai.request(server)
        .get(`/teams/${dummyId}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.labels[0].should.equal('Team');
          res.body.properties.should.have.property('name');
          res.body.properties.name.should.equal('Red');
          done();
        });
    });

    it('should get many Team on teams GET', (done) => {
      chai.request(server)
        .get(`/teams/`)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body[0].labels[0].should.equal('Team');
          res.body[1].labels[0].should.equal('Team');
          done();
        });
    });

    after(done => {
      const reset = neo4j.resetLabel('Team');
      reset.then(() => done());
    })

});

describe('Relations', () => {
  var userId;
  var teamId;
  var orgaId;
  before(done => {
    const newUser = neo4j.createNode('User', {
      name: 'Test User',
      email: 'test_user@gmail.com'
    });
    const newTeam = neo4j.createNode('Team', {
      name: 'Red',
    });
    const newOrganization = neo4j.createNode('Organization', {
      name: 'Yutani',
    });

    Promise.all([newUser,newTeam,newOrganization]).then(data => {
      userId = helpers.getNodeField(data[0]).identity.low;
      teamId = helpers.getNodeField(data[1]).identity.low;
      orgaId = helpers.getNodeField(data[2]).identity.low;
      done();
    });

  });

  it('should add a user to an organization on organizations/:id/addUser POST', done => {
    chai.request(server)
      .post(`/organizations/${orgaId}/addUser`)
      .send({
        userId,
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.start.low.should.equal(userId);
        res.body.end.low.should.equal(orgaId);
        res.body.type.should.equal('BELONGS_TO');
        done();
      });

  })
  it('should add a user to a team on teams/:id/addUser POST', done => {
    chai.request(server)
      .post(`/teams/${teamId}/addUser`)
      .send({
        userId,
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.start.low.should.equal(userId);
        res.body.end.low.should.equal(teamId);
        res.body.type.should.equal('BELONGS_TO');
        done();
      });
  })
  it('should list the users of an organization on organizations/:id/users GET', done => {
    chai.request(server)
      .get(`/organizations/${orgaId}/users`)
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body[0].labels[0].should.equal('User');
        res.body[0].properties.name.should.equal('Test User');
        done();
      });
  })
  it('should list the users of a team on team/:id/users GET', done => {
    chai.request(server)
      .get(`/teams/${teamId}/users`)
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body[0].labels[0].should.equal('User');
        res.body[0].properties.name.should.equal('Test User');
        done();
      });
  })

  it('should list the teams and organisations of a user on users/:id/groups GET', done => {
    chai.request(server)
      .get(`/users/${userId}/groups`)
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        done();
      });
  })

  after(done => {
    const resetUsers = neo4j.resetLabel('User');
    const resetOrgas = neo4j.resetLabel('Organization');
    const resetTeams = neo4j.resetLabel('Team');
    Promise.all([resetUsers,resetOrgas,resetTeams]).then(() => done());
  })
})
