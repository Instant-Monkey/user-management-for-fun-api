
function Team(prop) {
  this.name = String(prop.name);
  this.added = Date.now();
}

module.exports = Team;
