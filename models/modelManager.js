const User = require('./User');

module.exports = {
  createModel: (model, properties) => {
    switch(model) {
      case 'User':
        return {
          query: "name: $name,email: $email",
          model: new User(properties)
        };
    }
  },
}
