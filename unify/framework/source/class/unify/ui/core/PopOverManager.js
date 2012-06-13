/*
===============================================================================================

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2011 Deutsche Telekom AG, Germany, http://telekom.com
               2012 Sebastian Fastner, Mainz, Germany, http://unify-training.com

===============================================================================================
*/


(function() {
  
  var zIndexBase = 100;
  

/**
 * Handles pop over stacking (and blocking elements)
 */
core.Class("unify.ui.core.PopOverManager", {
  include : [unify.core.Object],
  
  /*
  ----------------------------------------------------------------------------
     CONSTRUCTOR
  ----------------------------------------------------------------------------
  */
    
  construct : function() {
    unify.core.Object.call(this);
    
    var root = this.__root = unify.core.Init.getApplication().getRoot();
    this.__visibleOverlays = [];
    this.__overlays={};
    this.__styleRegistry = {};
    
    zIndexBase = core.Env.getValue("unify.config.zIndexBase") || zIndexBase;
    
    var pblocker = this.__pblocker = document.createElement("div");
    var pstyle = unify.theme.Manager.get().resolveStyle("POPOVER-BLOCKER");
    pstyle.display = "none";
    core.bom.Style.set(pblocker, pstyle);
    pblocker.id = "popover-blocker";
    
    var mblocker = this.__mblocker = document.createElement("div");
    var mstyle = unify.theme.Manager.get().resolveStyle("MODAL-BLOCKER");
    mstyle.display = "none";
    core.bom.Style.set(mblocker, mstyle);
    mblocker.id = "modal-blocker";
    
    this.addNativeListener(pblocker, "tap", this.__onTapBlocker, this);
    
    var rootElement = root.getViewportElement();
    rootElement.appendChild(pblocker);
    rootElement.appendChild(mblocker);
  },
  
  events : {
    /** Show popup event */
    "show" : lowland.events.DataEvent,
    
    /** Hide popup event */
    "hide" : lowland.events.DataEvent
  },
  
  properties : {
    "autoResize" : {
      type: "Boolean",
      init: false,
      apply : function(value, old) { if (value !== old) { this.__applyAutoResize(value); }}
    }
  },

  /*
  ----------------------------------------------------------------------------
     MEMBERS
  ----------------------------------------------------------------------------
  */
    
  members :
  {
    __root : null,
    __visibleOverlays : null,
    __pblocker : null,
    __mblocker : null,
    
    __getDocHeight : function() {
      return Math.max(
        Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
        Math.max(document.body.offsetHeight, document.documentElement.offsetHeight),
        Math.max(document.body.clientHeight, document.documentElement.clientHeight)
      );
    },
    
    __resizeHandler : function(e) {
      var height = this.__getDocHeight() + "px";
      core.bom.Style.set(this.__mblocker, "height", height);
      core.bom.Style.set(this.__pblocker, "height", height);
    },
    
    __applyAutoResize : function(value) {
      if (value) {
        this.addNativeListener(window, "resize", this.__resizeHandler, this);
        this.__resizeHandler();
      } else {
        this.removeNativeListener(window, "resize", this.__resizeHandler, this);
      }
    },
    
    /**
     * Applies correct zIndex to all visible pop-overs
     * and positions blocker below the topmost visible popover.
     */
    __sortPopOvers : function()
    {
      var visible = this.__visibleOverlays;
      var pblocker = this.__pblocker;
      var mblocker = this.__mblocker;

      var numVisible = visible.length;
      for (var i=0; i<numVisible; i++) {
        var widget = visible[i];
        if (widget.setOuterStyle) {
          widget.setOuterStyle({zIndex: zIndexBase + 2*i});
        } else {
          widget.setStyle({zIndex: zIndexBase + 2*i});
        }
      }

      if (numVisible > 0) {
        var mSet=false;
        var pSet=false;
        for(var i=numVisible-1;i>=0;i--){
          var modal = visible[i].getModal();

          if(!mSet && modal){
            var styleState = visible[i].getUserData("blockerState");
            if (styleState) {
              var val = styleState;
              styleState = {};
              styleState[val] = true;
            }
            
            var style = unify.theme.Manager.get().resolveStyle("MODAL-BLOCKER") || {};
            style.zIndex = (zIndexBase-1)+2*i;
            style.display = 'block';
            core.bom.Style.set(mblocker, style);
            
            mSet = true;
          } else if (!pSet && !modal){
            var styleState = visible[i].getUserData("blockerState");
            if (styleState) {
              var val = styleState;
              styleState = {};
              styleState[val] = true;
            }
            
            var style = unify.theme.Manager.get().resolveStyle("POPOVER-BLOCKER") || {};
            style.zIndex = (zIndexBase-1)+2*i;
            style.display = 'block';
            core.bom.Style.set(pblocker, style);
            
            pSet = true;
          }
          if (mSet&&pSet) {
            break;
          }
        }
        if(!mSet){
          mblocker.style.zIndex = null;
          mblocker.style.display = 'none';
        }
        if(!pSet){
          pblocker.style.zIndex = null;
          pblocker.style.display = 'none';
        }
      } else {
        pblocker.style.zIndex = null;
        mblocker.style.zIndex = null;
        pblocker.style.display = 'none';
        mblocker.style.display = 'none';
      }
    },

    /**
     * Closes topmost popover
     */
    __onTapBlocker : function(){
      var numVisible = this.__visibleOverlays.length;
      
      if (numVisible > 0) {
        var topMost = this.__visibleOverlays[numVisible-1];
        this.hide(topMost);
      } else {
        this.error("tapped on blocker without visible viewmanager");
        //sort popovers again to make sure the blocker is gone
        this.__sortPopOvers();
      }
    },

    /**
     * Shows the view manager with the given ID.
     *
     * @param widget {unify.ui.core.IPopOver} Widget to show
     * @param position {String|Map|unify.ui.Widget?"center"} Position of widget ("center", "window", {left:50,top:50}) or trigger widget
     */
    show : function(widget, position) {
      if (core.Env.getValue("debug")) {
        this.debug("Show: " + (widget&&widget.constructor));
        core.Interface.assert(widget, unify.ui.core.IPopOver);
      }
      
      var pos = position || "center";

      if (core.Class.isClass(pos.constructor) && pos.constructor instanceof unify.ui.core.Widget.constructor) {
        if (widget.setTrigger) {
          widget.setTrigger(pos);
          pos = widget.getPositionHint();
        } else {
          pos = null;
        }
      } else if (pos == "center" || pos == "window") {
        pos = {left: "center", top: "center"};
      } else if (pos == "full") {
        pos = {left: 0, top: 0, right: 0, bottom: 0};
      }
      this.__root.add(widget, pos);
      this.__visibleOverlays.push(widget);
      this.__sortPopOvers();
      
      widget.show();
      
      this.fireEvent("show", widget);
    },
    
    
    /**
     * Hides the view manager with the given ID.
     *
     * @param widget {unify.ui.core.IPopOver} Widget to hide
     */
    hide : function(widget) {
      var self = this;
      
      var hideCallback=function(){
        self.__visibleOverlays.remove(widget);
        self.__sortPopOvers();
        
        self.fireEvent("hide", widget);
      };

      widget.addListenerOnce("changeVisibility", hideCallback, this);
      widget.hide();
    }
  }
});

unify.core.Singleton.annotate(unify.ui.core.PopOverManager);

})();