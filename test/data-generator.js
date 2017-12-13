// jshint ignore: start
window.dataGenerator = {
  environments: function() {
    var no = chance.integer({min: 1, max: 5});
    var result = [];
    for (var i = 0; i < no; i++) {
      result[result.length] = {
        name: chance.word(),
        created: chance.hammertime()
      };
    }
    return result;
  },

  variables: function() {
    var no = 10;
    var result = [];
    for (var i = 0; i < no; i++) {
      result[result.length] = {
        environment: 'default',
        variable: chance.word(),
        value: chance.word(),
        enabled: true,
        _id: 'default/' + chance.hammertime()
      };
    }
    return result;
  }
};
