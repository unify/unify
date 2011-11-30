/* ***********************************************************************************************

 Unify Project

 Homepage: unify-project.org
 License: MIT + Apache (V2)
 Copyright: 2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com

 *********************************************************************************************** */

/**
 * Base single animation
 */
qx.Class.define("unify.fx.Base", {
  extend: qx.core.Object,
  
  events : {
    start : "qx.event.type.Event",
    stop : "qx.event.type.Data"
  },
  
  properties : {
    duration : {
      check : "Integer"
    },
    
    easing : {
      check : "Function",
      nullable: true
    },
    
    value : {
    }
  },
  
  members : {
    __id : null,
    
    start : function(percent) {
      this._setup();
      
      var easing = this.getEasing() || function(i) { return i; };
      this.__id = unify.fx.Animation.getInstance().start(this._render, this._verifyRender, this.__finish, this.getDuration(), easing, percent||0, this);
      this.fireEvent("start");
    },
    
    stop : function() {
      if (this.__stop()) {
        this.fireDataEvent("stop", "break");
      }
    },
    
    reset : function() {
      this.__stop();
      this._reset();
      this.fireDataEvent("stop", "reset");
    },
    
    _setup : function() {
      
    },
    
    _reset : function() {
      
    },
    
    _render : function(percent, now, render) {
      
    },
    
    _verifyRender : function() {
      return true;
    },
    
    __stop : function() {
      var id = this.__id;
      
      if (id) {
        unify.fx.Animation.getInstance().stop(id);
        return true;
      }
      
      return false;
    },
    
    __finish : function(fps, id, finished) {
      if (finished) {
        this.fireDataEvent("stop", "done");
      }
    }
  }
});