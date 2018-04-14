const User = require('./User');
const Organization = require('./Organization');

module.exports = {
  createModel: (model, properties) => {
    switch(model) {
      case 'User':
        return {
          query: "name: $name,email: $email",
          model: new User(properties)
        };
      case 'Organization':
        return {
          query: "name: $name",
          model: new Organization(properties)
        };
    }
  },
}
