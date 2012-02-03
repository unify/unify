core.Module("unify.core.Statics", {
  annotate: function(Clazz, statics) {
    var keys = Object.keys(statics);
    for (var i=0,ii=keys.length; i<ii; i++) {
      var key = keys[i];
      Clazz[key] = statics[key];
    }
  }
});