
function User(prop) {
  this.name = String(prop.name);
  this.email = String(prop.email);
  this.added = Date.now();
}

module.exports = User;
