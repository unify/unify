/* ***********************************************************************************************

 Unify Project

 Homepage: unify-project.org
 License: MIT + Apache (V2)
 Copyright: 2012, Dominik Göpel

 *********************************************************************************************** */

/**
 * EXPERIMENTAL
 *
 * extension of unify.ui.container.Scroll adding pull action support
 */
qx.Class.define("unify.ui.container.ActionScroll", {
  extend : unify.ui.container.Scroll,

  /**
   * constructor
   * @param notificationHeight {Number} height of the notification widget and triggerpoint for activation 
   * @param topAction {function|null} action to execute when pull occurs on top
   * @param bottomAction {function|null} action to execute when pull occurs on bottom
   * @param layout {qx.ui.core.layout.Abstract|null} layout for the content container
   */
  construct: function(notificationHeight,topAction,bottomAction,layout){
    this.__notificationHeight=notificationHeight||100;
    var notifications= this.__notifications= this.__createNotifications();
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
    
    this.__activateCallback=qx.lang.Function.bind(this._onActivatePullAction,this);
    this.__deactivateCallback=qx.lang.Function.bind(this._onDeactivatePullAction,this);
    this.__executeCallback=qx.lang.Function.bind(this._onExecutePullAction,this);
    this.base(arguments,layout);
    this._showChildControl("wrapper");
    this.addListener("changeAppearance",this.__updateNotificationAppearance,this);
  },
  
  events:{
    //fires when an action is activated
    actionActivated: "qx.event.type.Data",
    
    //fires when an action is deactivated (either by the user dragging back out of the active zone or after the execution
    actionDeactivated: "qx.event.type.Data",
    
    //fires when an action is executed
    actionExecuted: "qx.event.type.Data",
    
    //fires when an action finished (that is, when finishedPullAction was called after the action was executed).
    actionFinished: "qx.event.type.Data"
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
        this.__setupActions();
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
        this.__setupActions();
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
          var baseContent=this.getChildControl("content")//get base content element
          child= this.__contentWrapper=new unify.ui.container.Composite(new unify.ui.layout.Canvas);//create wrapper
          child.add(this.getNotification("top"),{top:0,left:0,right:0});
          child.add(baseContent,{top:0,bottom:0,right:0,left:0});//removes baseContent from its original parent!
          child.add(this.getNotification("bottom"),{bottom:0,left:0,right:0});
          child.setStyle({overflowY:"visible"});
          this._addAt(child,0,{type:"content"});//add wrapper where content was
        }
        break;
        default:
          child=this.base(arguments,id);
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
    
    __updateNotificationAppearance: function(e){
      var notifications=this.__notifications;
      var appearance=e.getData();
      for(var location in notifications){
        notifications[location].setAppearance(appearance+"/"+location+"Notification");
      }
    },
    
    __createNotifications : function(){
      var topNotification=this._createNotification("top");
      var bottomNotification=this._createNotification("bottom");
      topNotification.setAppearance(this.getAppearance() + "/topNotification" );
      bottomNotification.setAppearance(this.getAppearance() + "/bottomNotification" );
      var notifications={ 
            top:topNotification,
            bottom:bottomNotification
          };
      return notifications;
    },
    
    getNotification: function(location){
      return this.__notifications[location];
    },
    
    //overridden
    _getScrollerContentWidget: function(){
      return this.__contentWrapper||this.getChildControl("wrapper");
    },

    /**
     * setup actions based on current configuration
     * 
     * shows/excludes notifications
     * 
     * @return {Boolean} true if at least one action is enabled
     * @private
     */
    __setupActions: function(){
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
      return hasAction;
    },
    
    //overridden
    _createScroller: function(){
      var scroller=this.__baseScroller=this.base(arguments);
      
      var hasAction=this.__setupActions();
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
      this.fireDataEvent("actionActivated",location);
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
      this.fireDataEvent("actionDeactivated",location);
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
        this.fireDataEvent("actionExecuted",location);
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
      this.fireDataEvent("actionFinished",location);
      this.__baseScroller.finishPullToRefresh(location);
    }
  },
  
  destruct: function(){
    this._disposeMap("__notifications");
    this._disposeObjects("__contentWrapper","__content");
    this.__notificationsEnabled
      =this.__actions
      =this.__actionsEnabled
      =this.__actionsRunning
      =this.__baseScroller
      =this.__activateCallback
      =this.__deactivateCallback
      =this.__executeCallback
      =null;
  }
});