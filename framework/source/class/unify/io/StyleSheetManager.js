/* ***********************************************************************************************

    Unify Project
    
    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/**
 * Manage StyleSheets which basically means loading them and firing
 * events when styles are loaded. Also prevents duplicate files being
 * loaded.
 */
qx.Class.define("unify.io.StyleSheetManager",
{
	extend : qx.core.Object,
	type : "singleton",
	
	
	/*
	*****************************************************************************
		 CONSTRUCTOR
	*****************************************************************************
	*/
		
	construct : function()
	{
		this.base(arguments);
		
		this.__registry = {};
		this.__elements = {};
		
		this.__timer = new qx.event.Timer(50);
		this.__timer.addListener("interval", this.__onInterval, this);
	},
	
	
	
	/*
	*****************************************************************************
		 EVENTS
	*****************************************************************************
	*/
		
	events : 
	{
		/** Data event which contains the url loaded. Fired with every stylesheet */
		load : "qx.event.type.Data",
		
		/** Fired when all pending requests where loaded successfully. */
		completed : "qx.event.type.Event"
	},
	
	
	
	/*
	*****************************************************************************
		 MEMBERS
	*****************************************************************************
	*/
	
	members : 
	{
		/** {Object} Native timer handle */
		__timer : null,
		
		/** {Map} Registry of all URLs to load */
		__registry : null,
		
		/** {Map} Maps URLs to DOM elements of stylesheets */
		__elements : null,
		
		
		/*
		---------------------------------------------------------------------------
			PUBLIC API
		---------------------------------------------------------------------------
		*/
				
		/**
		 * Load the given URL
		 * 
		 * @param url {String} URL to load
		 */
		load : function(url)
		{
			var reg = this.__registry;
			if (reg[url] != null) {
				return;
			}
			
			// this.info("Loading file: " + url);
			reg[url] = false;
			this.__loadFile(url);			
		},
		
		
		/**
		 * Whether the given URL is loaded.
		 * 
		 * @param url {String} URL to load
		 * @return {Boolean} <code>true</code> when the file was loaded.
		 */
		isLoaded : function(url) {
			return this.__registry[url] === true;
		},
		
		
		/**
		 * Whether the manager is loading styles right now.
		 * 
		 * @return {Boolean} <code>true</code> when styles are being loaded right now.
		 */
		isRunning : function() {
			return this.__timer.getEnabled();
		},
		
		
		
		/*
		---------------------------------------------------------------------------
			INTERNALS
		---------------------------------------------------------------------------
		*/
				
		/**
		 * Internal method to add another file to the browser loading queue.
		 * Automatically triggers the interval to being active and waits for loading.
		 * 
		 * @param url {String} The URL to load
		 */
		__loadFile : function(url)
		{
			var doc = document;
			var el = this.__elements[url] = doc.createElement("link");
			
			el.type = "text/css";
			el.rel = "stylesheet";
			el.href = qx.util.ResourceManager.getInstance().toUri(url) + "?r=" + (new Date).valueOf();

			var head = doc.getElementsByTagName("head")[0];
			head.appendChild(el);
			
			this.__timer.setEnabled(true);
		},		
		
		/**
		 * Event listener for interval event of timer. 
		 * 
		 * @param e {qx.event.type.Event} Event object.
		 */
		__onInterval : function(e)
		{
			var elems = this.__elements;
			var registry = this.__registry;
			var active = false;
			var length;
			
			for (var url in registry)
			{
				if (registry[url] === false)
				{
					try {
						length = elems[url].sheet.cssRules.length;
					} catch(ex) {
						length = 0;
					}			
					
					if (length > 0) 
					{
						registry[url] = true;
						this.fireDataEvent("load", url);
					}
					else
					{
						active = true;
					}					
				}			
			}
			
			if (!active) 
			{
				this.__timer.setEnabled(false);
				this.fireEvent("completed");
			}
		}	
	},
	
	
	
	/*
	*****************************************************************************
		 DESTRUCTOR
	*****************************************************************************
	*/	
	
	destruct : function()
	{
		if (this.__timer)
		{
			this.__timer.dispose();
			this.__timer = null;
		}
		
		this.__elements = null;
	}	
});
