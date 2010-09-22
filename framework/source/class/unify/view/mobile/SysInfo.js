/* ***********************************************************************************************

    Unify Project
    
    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/**
 * Contains informations about the system and features.
 */
qx.Class.define("unify.view.mobile.SysInfo",
{
	extend : unify.view.mobile.ServiceView,
	type : "singleton",
	
	
	/*
	*****************************************************************************
		 MEMBERS
	*****************************************************************************
	*/

	members :
	{
		__content : null,
		
		
		
		
		/*
		---------------------------------------------------------------------------
			STATIC VIEW INTERFACE
		---------------------------------------------------------------------------
		*/
		
		// overridden
		getTitle : function(type, param) {
			return "System Info";
		},
				
				
		// overridden
		getDefaultSegment : function() {
			return "basics";
		},
		
		
		// overridden
		_createView : function() 
		{
			var layer = new unify.ui.mobile.Layer(this);
			
			var toolbar = new unify.ui.mobile.ToolBar(this);
			layer.add(toolbar);

			var segmented = new unify.ui.mobile.Segmented(this);
			segmented.add({ label : "Basics", segment : "basics" });
			segmented.add({ label : "Environment", segment : "env" });
			segmented.add({ label : "Features", segment : "features" });
			toolbar.add(segmented);

			var scrollview = this.__content = new unify.ui.mobile.ScrollView(this);
			scrollview.setEnableScrollX(false);
			layer.add(scrollview);
			
			return layer;
		},
		
		
		
		/*
		---------------------------------------------------------------------------
			SERVICE VIEW INTERFACE
		---------------------------------------------------------------------------
		*/
		
		// overridden
		_getBusinessObject : function() {
			return unify.business.SysInfo.getInstance();
		},

		// overridden
		_getServiceName : function() {
			return this.getSegment();
		},
		
		// overridden
		_getRenderVariant : function() {
			return this.getSegment();
		},		
		
		// overridden
		_renderData : function(data)
		{
			var html = "";
			var header, fields, title;
			for (header in data)
			{
				html += "<h2>" + header + "</h2>";
				html += "<ul>";
				
				fields = data[header];
				for (title in fields) {
					html += "<li><label>" + title + "</label><span>" + fields[title] + "</span></li>";
				}

				html += "</ul>";
			}			
			
			this.__content.replace(html);			
		}
	}
});
