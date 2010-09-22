/* ***********************************************************************************************

    Unify Project
    
    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/**
 * Displays details of Twitter users.
 */
qx.Class.define("tweet.view.mobile.Status",
{
	extend : unify.view.mobile.RemoteView,
	type : "singleton",	 

	members :
	{
		__content : null,
		
		
		
		/*
		---------------------------------------------------------------------------
			VIEW INTERFACE
		---------------------------------------------------------------------------
		*/

		// overridden
		getTitle : function(type, param) {
			return this.getParam() || "Status";
		},
		
		
		// overridden
		_createView : function() 
		{
			var layer = new unify.ui.mobile.Layer(this);

			var titlebar = new unify.ui.mobile.TitleBar(this);
			layer.add(titlebar);
			
			var content = this.__content = new unify.ui.mobile.Content;
			layer.add(content);

			var toolbar = new unify.ui.mobile.ToolBar(this);
			toolbar.add({ icon : true, exec : "favorite", target : "left" });
			toolbar.add({	label : "Retweet", exec : "retweet", target : "right" });
			layer.add(toolbar);
						
			return layer;
		},
		
		
		

		/*
		---------------------------------------------------------------------------
			BUSINESS LAYER VIEW INTERFACE
		---------------------------------------------------------------------------
		*/		
		
		// overridden
		_getBusinessObject : function() {
			return tweet.business.TwitterAnon.getInstance();
		},
		
		
		// overridden
		_getServiceName : function() {
			return "status";
		},
		
		
		// overridden
		_getServiceParams : function() 
		{
			return { 
				id : this.getParam() 
			};
		},		
		
		
		// overridden
		_renderData : function(data)
		{
			var Twitter = tweet.util.Twitter;
			
			var html = '';
			html += '<div class="user">';			
				html += '<img src="' + data.user.profile_image_url + '"/> ';
				html += '<div>'
					html += '<p>' + data.user.name + '</p>';
					html += '<p goto="user:' + data.user.screen_name + '">@' + data.user.screen_name + '</p>';
					html += '<p>#' + data.user.id + '</p>';			 
				html += '</div>';
			html += '</div>';
			html += '<p class="statustext">';
				html += Twitter.getFormattedDate(data) + ' ago: ' + Twitter.getFormattedText(data);
			html += '</p>';
			
			this.__content.replace(html);
		},
		
		
		// overridden
		_errorHandler : function(reason, detail) {
			this.error("Could not load data: " + reason + ": " + detail);
		}		
	}
});
