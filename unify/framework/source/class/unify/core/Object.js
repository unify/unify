/**
 * @require {core.ext.Object}
 * @require {core.ext.String}
 * @require {core.ext.Function}
 */
core.Class("unify.core.Object", {
  include : [lowland.Object],
  
  construct : function() {
    lowland.Object.call(this);
  }
});