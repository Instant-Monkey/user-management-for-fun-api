module.exports = {
  getNodeField: neoNode => {
    const singleRecord = neoNode.records[0];
    const node = singleRecord.get(0);
    return node;
  },
  getNodeArray: neoNodes => neoNodes.map((node) => node.get(0)),
}
