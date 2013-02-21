/*
===============================================================================================

 Unify Project

 Homepage: unify-project.org
 License: MIT + Apache (V2)
 Copyright: 2012, Dominik Göpel

 ===============================================================================================
*/

/**
 * EXPERIMENTAL
 *
 * extension of unify.ui.container.Scroll adding pull action support
 */
core.Class("unify.ui.container.ActionScroll", {
	include : [unify.ui.container.Scroll],

	/**
	 * constructor
	 * @param notificationHeight {Number} height of the notification widget and triggerpoint for activation 
	 * @param topAction {function|null} action to execute when pull occurs on top
	 * @param bottomAction {function|null} action to execute when pull occurs on bottom
	 * @param layout {qx.ui.core.layout.Abstract|null} layout for the content container
	 */
	construct: function(notificationHeight,topAction,bottomAction,layout){
		this.__notificationHeight=notificationHeight||100;
		var notifications=this.__notifications={ 
			top:this.getChildControl("topNotification"),
			bottom:this.getChildControl("bottomNotification")
		}
		this.__notificationsEnabled={
			top: !!notifications["top"],
			bottom: !!notifications["bottom"]
		};
		this.__actions={
			top: topAction,
			bottom: bottomAction
		};
		this.__actionsEnabled={
			top:!!topAction,
			bottom:!!bottomAction
		};
		this.__actionsRunning={
			top:false,
			bottom:false
		};
		
		this.__activateCallback=this._onActivatePullAction.bind(this);
		this.__deactivateCallback=this._onDeactivatePullAction.bind(this);
		this.__executeCallback=this._onExecutePullAction.bind(this);
		unify.ui.container.Scroll.call(this,layout);
		this._showChildControl("wrapper");
	},
	
	events:{
		//fires when an action is activated
		actionActivated: core.event.Simple,
		
		//fires when an action is deactivated (either by the user dragging back out of the active zone or after the execution
		actionDeactivated: core.event.Simple,
		
		//fires when an action is executed
		actionExecuted: core.event.Simple,
		
		//fires when an action finished (that is, when finishedPullAction was called after the action was executed).
		actionFinished: core.event.Simple
	},
	
	members: {
		//widget that wraps around original scroll content
		__contentWrapper: null,
		
		//original scroll content
		__content: null,
		
		//map of notification widgets by location
		__notifications:null,
		
		//map of booleans by location that defines which notifications are shown e.g. {top: true, bottom: false}
		__notificationsEnabled:null,
		
		//map of functions by location that contains the actions to execute
		__actions:null,
		
		//map of booleans by location that defines which actions are enabled  e.g. {top: true, bottom: false}
		__actionsEnabled:null,
		
		//map of booleans by location that shows which actions are currently running
		__actionsRunning:null,
		
		//height of the notification widgets and triggerpoint for activation (scroll more than this and action will be executed)
		__notificationHeight:null,
		
		//reference to scroller from baseclass
		__baseScroller:null,
		
		/**
		 * enables/disables configured actions 
		 * 
		 * useful if you want to disable actions temporarily
		 * 
		 * @param map {Map} allowed keys: top, bottom allowed values: boolean. e.g. {top:true,bottom:false}
		 * @return {void}
		 */
		setActionsEnabled: function(map){
			var actionsEnabled=this.__actionsEnabled;
			var changed=((map.top!=actionsEnabled.top)||(map.bottom!=actionsEnabled.bottom));
			this.__actionsEnabled=map;
			if(changed){
				this._createScroller();
			}
		},
		
		/**
		 * enables/disables notificatoins
		 * 
		 * useful if you want to be able to execute an action but don't show a notification
		 * 
		 * @param map {Map} allowed keys: top, bottom allowed values: boolean. e.g. {top:true,bottom:false}
		 * @return {void}
		 */
		setNotificationsEnabled: function(map){
			var notificationsEnabled=this.__notificationsEnabled;
			var changed=((map.top!=notificationsEnabled.top)||(map.bottom!=notificationsEnabled.bottom));
			this.__notificationsEnabled=map;
			if(changed){
				this._createScroller();
			}
		},

		/**
		 * getter for notification height
		 * @return {Number} the configured height for notifications
		 */
		getNotificationHeight: function(){
			return this.__notificationHeight;
		},

		//overridden
		_createChildControlImpl: function(id){
			var child;
			switch(id){
				case "wrapper":{
					/*var baseContent=this.getChildControl("content")//get base content element
					child= this.__contentWrapper=new unify.ui.container.Composite(new unify.ui.layout.Canvas);//create wrapper
					child.add(this.getChildControl("topNotification"),{top:0,left:0,right:0});
					child.add(baseContent,{top:0,bottom:0,right:0,left:0});//removes baseContent from its original parent!
					child.add(this.getChildControl("bottomNotification"),{bottom:0,left:0,right:0});
					child.setStyle({overflowY:"visible"});
					this._addAt(child,0,{type:"content"});//add wrapper where content was*/
					
					var baseContent=this.getChildControl("content")//get base content element
					child= this.__contentWrapper=new unify.ui.container.Composite(new unify.ui.layout.VBox);//create wrapper
					child.add(this.getChildControl("topNotification"));
					child.add(baseContent);//removes baseContent from its original parent!
					child.add(this.getChildControl("bottomNotification"));
					child.setStyle({overflowY:"visible"});
					this._addAt(child,0,{type:"content"});//add wrapper where content was
				}
				break;
				case "topNotification":{
					child=this._createNotification("top");
				}
				break;
				case "bottomNotification":{
					child=this._createNotification("bottom");
				}
				break;
				default:
					child=unify.ui.container.Scroll.prototype._createChildControlImpl.call(this,id);
			}
			return child;
		},

		/**
		 * creates the notification widget for action at location
		 * 
		 * override this if you want a different implementation than ActionNotification
		 * 
		 * @param location
		 * @return {unify.ui.container.scroll.IActionNotification} action notification widget
		 */
		_createNotification: function(location){
			return new unify.ui.container.scroll.ActionNotification(this,location);
		},
		//overridden
		_getScrollerContentWidget: function(){
			return this.__contentWrapper||this.getChildControl("wrapper");
		},
		
		//overridden
		_createScroller: function(){
			var scroller=this.__baseScroller=unify.ui.container.Scroll.prototype._createScroller.call(this);
			var actions=this.__actions;
			var actionsEnabled=this.__actionsEnabled;
			var notifications=this.__notifications;
			var notificationsEnabled=this.__notificationsEnabled;
			
			var actionlocations=["top","bottom"];
			var hasAction=false;
			for (var i =0,ii=actionlocations.length;i<ii;i++){
				var location=actionlocations[i];
				var action=actions[location];
				var actionEnabled=actionsEnabled[location];
				var notification=notifications[location];
				var notificationEnabled=notificationsEnabled[location];
				
				if(action && actionEnabled){
					hasAction=true;
					if(notification){
						if(notificationEnabled){
							notification.show();
						} else {
							notification.exclude();
						}
					} 
				} else {
					if(notification){
						notification.exclude();
					}
				}
			}

			if(hasAction){
				
				//make sure scroller properties are set correctly (allow bouncing, scrollY, no scrollX, scroll on small content)
				if(!this.getScrollOnSmallContent()){
					this.setScrollOnSmallContent(true);
				}
				if(this.getEnableScrollX()){
					this.setEnableScrollX(false);
				}
				if(!this.getEnableScrollY()){
					this.setEnableScrollY(true);
				}
				if(!this.getBounces()){
					this.setBounces(true);
				}

				scroller.activatePullToRefresh(this.__notificationHeight, this.__activateCallback, this.__deactivateCallback, this.__executeCallback);
			} 
			
			return scroller;
		},

		/**
		 * callback for pull action activation
		 * @param location {String} the location of the action
		 */
		_onActivatePullAction: function(location){
			if(this.__actionsRunning[location]){
				return;
			}
			var notification=this.__notifications[location];
			if(notification){
				notification.setPhase("activated");
			}
			this.fireEvent("actionActivated",location);
		},
		
		/**
		 * callback for pull action deactivation
		 * @param location {String} the location of the action
		 */
		_onDeactivatePullAction: function(location){
			if(this.__actionsRunning[location]){
				return;
			}
			var notification=this.__notifications[location];
			if(notification){
				notification.setPhase("initial");
			}
			this.fireEvent("actionDeactivated",location);
		},
		
		/**
		 * callback for pull action execution
		 * @param location {String} the location of the action
		 */
		_onExecutePullAction: function(location){
			if(this.__actionsRunning[location]){
				return;
			}
			
			var action=this.__actions[location];
			var actionEnabled=this.__actionsEnabled[location];
			if(action && actionEnabled){
				var notification=this.__notifications[location];
				if(notification){
					notification.setPhase("executing");
				}
				this.__actionsRunning[location]=true;
				action();
				this.fireEvent("actionExecuted",location);
			} else {
				this.finishedPullAction(location);
			}
		},

		/**
		 * executes the pull action for location
		 * 
		 * This function is for applications that want to start the action programmatically
		 * 
		 * @param location {String} the location of the action
		 */
		executeAction: function(location){
			if(this.__actionsRunning[location]){
				return;
			}
			if(this.__actionsEnabled[location]){
				this.__baseScroller.executePullToRefresh(location);
			}
		},

		/**
		 * callback that has to be called when an action completes
		 * 
		 * @param location {String} location of the completed action
		 */
		finishedPullAction : function(location){
			this.__actionsRunning[location]=false;
			this.fireEvent("actionFinished",location);
			this.__baseScroller.finishPullToRefresh(location);
		}
	}
});