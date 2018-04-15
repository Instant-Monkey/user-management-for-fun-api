const User = require('./User');
const Organization = require('./Organization');
const Team = require('./Team');

module.exports = {
  createModel: (model, properties) => {
    switch(model) {
      case 'User':
        return {
          query: "name: $name,email: $email,added: $added",
          model: new User(properties)
        };
      case 'Organization':
        return {
          query: "name: $name,added: $added",
          model: new Organization(properties)
        };
      case 'Team':
        return {
          query: "name: $name,added: $added",
          model: new Team(properties)
        };
    }
  },
}
