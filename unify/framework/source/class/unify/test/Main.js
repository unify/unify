
/**
 * #require(lowland.test.qunit)
 * #require(lowland.ext.Function)
 */

var global = this;
$(function() {
	
	core.Env.define("debug", true);
	unify.test.theme.Theme.test();
	unify.test.ui.core.VisibleBox.test();
	
});