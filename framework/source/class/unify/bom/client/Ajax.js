/* ************************************************************************

	 Unify Framework

	 Copyright:
		 2009 Deutsche Telekom AG, Germany, http://telekom.com

************************************************************************ */

/**
 * XMLHttpRequest helper to simplify creation of the nativ object
 */
qx.Class.define("unify.bom.client.Ajax",
{
	statics : 
	{
		/** {Boolean} Whether HTTP requests are supported */
		SUPPORTED : false,
		
		/** {Boolean} Whether the native object is available */
		NATIVE : false,
		
		/** {String} The name of the ActiveX class, when used */
		ACTIVEX : null,
		
		/** {Boolean} Whether cross domain is supported */
		CROSS_DOMAIN : false,
		
		/** {Boolean} Whether file uploads are supported */
		UPLOAD_SUPPORT : false,
		
		/** {Boolean} Whether a progress event is supported */
		PROGRESS_EVENT : false,

		/** {Boolean} Whether a progress event is supported */
		LOADSTART_EVENT : false,
		
		/** {Boolean} Whether a progress event is supported */
		TIMEOUT_EVENT : false,
		
		
		/** 
		 * Returns a new instance of a XMLHttpRequest object.
		 * 
		 * @return {Object} New instance
		 */
		create : function() {
			return this.NATIVE ? new XMLHttpRequest : this.ACTIVEX ? new ActiveXObject(this.ACTIVEX) : null;
		}
	},
	
	defer : function(statics)
	{
		var obj;
		if (window.XMLHttpRequest)
		{
			try{
				obj = new XMLHttpRequest;
			} catch(ex1) {}
		}
		else if (window.ActiveXObject)
		{
			var axtype;
			try
			{
				obj = new ActiveXObject("MSXML2.XMLHTTP.6.0");
				axtype = "MSXML2.XMLHTTP.6.0";
			}
			catch(ex2) 
			{
				try
				{
					obj = new ActiveXObject("MSXML2.XMLHTTP.3.0");
					axtype = "MSXML2.XMLHTTP.3.0";
				} 
				catch(ex3) {}				
			}		
		}
		
		if (!obj) {
			return;
		}
		
		statics.SUPPORTED = true;
		statics.NATIVE = !axtype;
		statics.ACTIVEX = axtype || null;
		
		statics.CROSS_DOMAIN = "withCredentials" in obj || typeof window.XDomainRequest === "object";
		statics.UPLOAD_SUPPORT = "upload" in obj;

		statics.PROGRESS_EVENT = "onprogress" in obj;
		statics.LOADSTART_EVENT = "onloadstart" in obj;
		statics.TIMEOUT_EVENT = "ontimeout" in obj;
	}
});
