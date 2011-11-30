/* ***********************************************************************************************

 Unify Project

 Homepage: unify-project.org
 License: MIT + Apache (V2)
 Copyright: 2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com

 *********************************************************************************************** */

/**
 * Animate position of widget
 */
qx.Class.define("unify.fx.Position", {
  extend: unify.fx.Base,
  
  construct : function(widget) {
    this.base(arguments);
    
    this.__widget = widget;
  },
  
  members : {
    __mod : null,
    __anim : null,
    __resetPoint: null,
    
    _setup : function() {
      var to = this.getValue();
      var from = this.__resetPoint = this.__widget.getStyle("transform");
      
      var matcher = new RegExp("translate([^)]+)");
      var parsed = matcher.exec(from);
      var mod;
      if (parsed && parsed.length == 2) {
        var vals = parsed[1].substring(1).split(",");
        mod = this.__mod = {
          top: parseInt(vals[1],10),
          left: parseInt(vals[0],10)
        };
      } else {
        mod = this.__mod = {
          top: 0,
          left: 0
        };
      }
      
      this.__anim = {
        top: to.top - mod.top,
        left: to.left - mod.left
      };
    },
    
    _reset : function(value) {
      console.log("RESET: " + value);
      this.__widget.setStyle({
        transform: value||""
      });
    },
    
    _getResetValue : function() {
      return this.__resetPoint;
    },
    
    _render : function(percent, now, render) {
      var mod = this.__mod;
      var anim = this.__anim;
      
      var left = Math.round(mod.left + (anim.left * percent));
      var top = Math.round(mod.top + (anim.top * percent));

      this.__widget.setStyle({
        transform: "translate(" + left + "px, " + top + "px)"
      });
    }
  }
});