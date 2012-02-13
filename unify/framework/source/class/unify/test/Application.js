
/**
 * @require {unify.test.qunit}
 * @require {core.ext.Object}
 * @require {core.ext.Array}
 * @require {lowland.ext.Function}
 */

var global = this;
$(function() {
  
  core.Env.define("debug", true);
  unify.test.ui.layout.queue.Manager.runTest();
	
});
