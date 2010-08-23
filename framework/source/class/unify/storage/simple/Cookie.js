/**
 * Implementation for simple storage based on cookies.
 * 
 * Adds support for namespacing to run multiple applications on the same domain.
 */
qx.Class.define("unify.storage.simple.Cookie",
{
	extend : qx.core.Object,
	type : "singleton",
	implement : unify.storage.simple.ISimple,


	/*
	*****************************************************************************
		 CONSTRUCTOR
	*****************************************************************************
	*/
	
	construct : function()
	{
		this.base(arguments);
		
		this.__prefix = qx.core.Init.getApplication().getNamespace() + "/";
	},
	
	
	
	/*
	*****************************************************************************
		 STATICS
	*****************************************************************************
	*/	

	statics : 
	{
		isSupported : function() {
			// TODO
		},
		
		getPriority : function() {
			return 60;
		}
	},
	
	
	
	/*
	*****************************************************************************
		 MEMBERS
	*****************************************************************************
	*/	
	
	members :
	{
		__prefix : null,
		
		setItem : function(key, value) {
			return 
		},
		
		getItem : function(key) {
			return 
		},
		
		removeItem : function(key) {
			return 
		},		
		
		getLength : function() {
			return 
		},
		
		clear : function() {
			return 
		}
	},
	
	
	
	/*
	*****************************************************************************
		 DEFER
	*****************************************************************************
	*/
		
	defer : function(statics) 
	{
		if (statics.isSupported()) {
			unify.storage.Simple.register(statics);
		}
	}
});
