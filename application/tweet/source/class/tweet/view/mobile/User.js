/* ************************************************************************

	 Tweet

	 Copyright:
		 2009 Deutsche Telekom AG, Germany, http://telekom.com

************************************************************************ */

/**
 * Displays details of Twitter users.
 */
qx.Class.define("tweet.view.mobile.User",
{
	extend : unify.view.mobile.RemoteView,
	type : "singleton",	 

	members :
	{
		__content : null,
		
		
		
		/*
		---------------------------------------------------------------------------
			ABSTRACT VIEW INTERFACE
		---------------------------------------------------------------------------
		*/

		// overridden
		getTitle : function(type, param) 
		{
			var Twitter = tweet.business.TwitterAnon.getInstance();
			var data = Twitter.read("user", this.getParam());

			return data ? data.name : "User";
		},
		
				
		// overridden
		_createView : function() 
		{
			var layer = new unify.ui.mobile.Layer(this);
			layer.add(new unify.ui.mobile.TitleBar(this));
			
			var scrollview = this.__content = new unify.ui.mobile.ScrollView();
			scrollview.setEnableScrollX(false);
			layer.add(scrollview);

			var toolbar = new unify.ui.mobile.ToolBar(this);
			toolbar.add({ label : "Follow", exec : "follow" });
			toolbar.add({ label : "Block", exec : "block" });
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
			return "user";
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
			var html = "";

			html += '<div class="user">';
				html += '<img src="' + data.profile_image_url + '"/> ';
				html += '<div>'
					html += '<p>' + data.name + '</p>';
					html += '<p>@' + data.screen_name + '</p>';
					html += '<p>#' + data.id + '</p>';			
				html += '</div>';
			html += '</div>';
			
			html += '<p>' + (data.description || "no description available") + '</p>';

			html += '<ul>';
				html += '<li><label>Location</label><span>' + (data.location || "not available") + '</span></li>';
				html += '<li><label>URL</label><span>' + (data.url || "not available") + '</span></li>';
			html += '</ul>';

			html += '<ul>';
				html += '<li><label>Friends</label><span>' + data.friends_count + '</span></li>';
				html += '<li><label>Followers</label><span>' + data.followers_count + '</span></li>';
				html += '<li><label>Updates</label><span>' + data.statuses_count + '</span></li>';
				html += '<li><label>Favorites</label><span>' + data.favourites_count + '</span></li>';
			html += '</ul>';

			this.__content.replace(html);
		},
		
		
		// overridden
		_errorHandler : function(reason, detail) {
			this.error("Could not load data: " + reason + ": " + detail);
		}		
	}
});
