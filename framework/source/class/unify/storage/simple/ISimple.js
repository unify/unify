/**
 * Interface for simple storage implementations.
 * 
 */
qx.Interface.define("unify.storage.simple.ISimple",
{
	members : 
	{
		setItem : function(key, value) {},
		
		getItem : function(key) {},
		
		removeItem : function(key) {},		
		
		getLength : function() {},
		
		clear : function() {}		
	}
});
