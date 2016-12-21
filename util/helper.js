
exports.spread = function(f, self) {
  return function(args) {
    return f.apply(self, args);
  };
};

exports.extend = function(target) {
  for (var i=1; i<arguments.length; i++) for (var p in arguments[i]) target[p] = arguments[i][p];
}
