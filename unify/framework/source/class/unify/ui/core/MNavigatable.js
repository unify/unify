/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * Mixin to support navigation on widgets
 */
qx.Mixin.define("unify.ui.core.MNavigatable", {
  properties: {
    /**
     * Executes the given function on the view.
     * The function has to be public!
     */
    execute: {
      check: "String",
      init: null,
      nullable: true
    },
    
    /**
     * Opens hyperreference (=URL) in a new window or in the same tab depending on hyperreferenceWindowPolicy
     */
    hyperreference: {
      check: "String",
      init: null,
      nullable: true
    },
    
    /**
     * Rule for opening hyperreferences to foreign urls.
     * You can choose between
     * * same : Same tab
     * * window : New tab or window
     */
    hyperreferenceWindowPolicy : {
      check: ["same", "window"],
      init: "window",
      nullable: false
    },
    
    /**
     * Relational navigation. This property navigates relative to the current view.
     * Allowed parameters:
     * close - Close current view if it is a modal view on top of another one
     * parent - Navigate to the parent view in hierarchy
     * same - Take the same view, change segment or parameter
     * master - ?
     */
    relation: {
      check : ["close", "parent", "same", "master"],
      init: null,
      nullable: true
    },
    
    /**
     * Opens other view
     */
    goTo: {
      init: null,
      nullable: true
    },
    
    /**
     * Shows the viewmanager with this id as a popover
     */
    show: {
      init: null,
      nullable: true
    },

    /**
     * Configuration parameter for triggered popover (via show property)
     *
     * controls where the popover connects with this MNavigatable
     *
     * @see unify.view.PopOverManager#show
     */
    showTriggerPositionPolicy:{
      check:["lt","lc","lb","rt","rc","rb","tl","tc","tr","bl","bc","br"],
      init:"bc",
      nullable:true
    },

    /**
     * Configuration parameter for triggered popover (via show property)
     *
     * controls where the popover is connected with this MNavigatable
     *
     * @see unify.view.PopOverManager#show
     */
    showPopOverPositionPolicy:{
      check:["lt","lc","lb","rt","rc","rb","tl","tc","tr","bl","bc","br"],
      init:"tl",
      nullable:true
    },


    /**
     * Hides the view
     */
    hide: {
      init: null,
      nullable: true
    }
  },
  
  members : {
    /**
     * Applies event listeners on widget to support navigation
     */
    _applyMNavigatable : function() {
      this.addListener("tap", this.__onMNavigatableTap, this);
      this.addListener("touchhold", this.__onMNavigatableTouchHold, this);
      this.addListener("touchrelease", this.__onMNavigatableTouchRelease, this);
      this.addListener("touchleave", this.__onMNavigatableTouchRelease, this);
    },
    
    /**
     * Helper function to handle taps
     *
     * @param e {qx.event.type.Tap} Tap event
     */
    __onMNavigatableTap : function(e) {
      var viewManagerWidget = this.getLayoutParent();
      var viewManager = null;
      while (!viewManager && viewManagerWidget) {
        viewManager = viewManagerWidget.getUserData("viewManager");
        viewManagerWidget = viewManagerWidget.getLayoutParent();
      }
      
      if (qx.core.Environment.get("qx.debug")) {
        if (!viewManager) {
          this.warn("Widget " + this + " has no parent view manager!");
        }
      }
      
      var exec = this.getExecute();
      if (exec) {
        viewManager.getCurrentView()[exec](this);
      } else {
        // Detect absolute links
        var href = this.getHyperreference(); //elem.getAttribute("href");
        if (href != null && href != "" && href.charAt(0) != "#") {
          if (this.getHyperreferenceWindowPolicy() == "window") {
            window.open(href);
          } else {
            window.location = href;
          }
        } else if (!this.__navigates) {
          // Lazily navigate (omits navigation during activity)
          this.__navigates = true;
          qx.lang.Function.delay(this.__navigationWidgetHelper, 0, this, viewManager);
        }
      }
    },

    /**
     * event handler for touchhold.
     * adds state 'pressed' to this widget
     */
    __onMNavigatableTouchHold : function(){
      this.addState("pressed");
    },

    /**
     * event handler for touchrelease.
     * removese state 'pressed' from this widget
     */
    __onMNavigatableTouchRelease : function(){
      this.removeState("pressed");
    },

    /**
     * Executes navigation process on view manager
     *
     * @param viewManager {unify.view.ViewManager} View manager navigation is done on
     */
    __navigationWidgetHelper : function(viewManager) {
      // Reset event blocking flag
      this.__navigates = false;

      // Check up-navigation request first
      //var rel = elem.getAttribute("rel");
      var rel = this.getRelation();
      if (rel == "parent" || rel == "close")
      {
        var path = viewManager.getPath();
        if(path.length == 1) {
          if(viewManager.getDisplayMode()=='default'){
            viewManager.hide();
          } else {
            unify.view.PopOverManager.getInstance().hide(viewManager.getId());
          }
        } else {
          viewManager.navigate(path.slice(0, -1));
        }
        return;
      }
      
      // Support for showing/hiding another view manager (without a specific view e.g. a pop over)
      // TODO: Are there other kinds of view managers which might be shown here (not just popups)?
      //var show = elem.getAttribute("show");
      var show = this.getShow();
      if (show != null)
      {
        unify.view.PopOverManager.getInstance().show(show,this,this.getShowTriggerPositionPolicy(),this.getShowPopOverPositionPolicy());
        return;
      }

      //var hide = elem.getAttribute("hide");
      var hide = this.getHide();
      if (hide != null)
      {
        unify.view.PopOverManager.getInstance().hide(hide);
        return;
      }

      // Read attributes
      //var href = elem.getAttribute("href");
      var href = this.getHyperreference();
      //var dest = href ? href.substring(1) : elem.getAttribute("goto");
      var dest = href ? href.substring(1) : this.getGoTo();
      if (dest == null) {
        throw new Error("Empty destination found!");
      }

      // Valid Paths (leading with a "#" in href attributes):
      // localView.segment:param (in transition)
      // otherView.segment:param (globally known view => delegate to navigation)
      // .segment:param (switch segment and param, no transition)
      // .segment (switch segment, no transition)
      // :param (switch param, no transition)

      if (qx.core.Environment.get("qx.debug"))
      {
        if (rel) {
          throw new Error("Invalid 'rel' attribute: " + rel);
        }
      }
      
      var config = unify.view.Path.parseFragment(dest);
      var view = config.view;
      if (view && !viewManager.getView(view))
      {
        unify.view.Navigation.getInstance().navigate(new unify.view.Path(config));
      }
      else
      {
        // Read current path and make non-deep copy of path
        var path = viewManager.getPath();
        var clone = path.concat();
        var cloneLast = clone.length-1;
        
        // Select right modification point
        if (rel == "same") 
        {
          clone[cloneLast] = config;
        } 
        else if (config.view) 
        {
          clone.push(config);
        } 
        else 
        {
          if (config.segment) {
            clone[cloneLast].segment = config.segment;
          }

          if (config.param) {
            clone[cloneLast].param = config.param;
          }
        }

        // Finally do the navigate()
        viewManager.navigate(clone);
      }
    }
  }
});