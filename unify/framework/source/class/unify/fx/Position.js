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
  extend: unify.fx.core.Base,
  
  members : {
    __mod : null,
    __anim : null,
    __resetPoint: null,
    
    /**
     * Calculates position information to real numbers
     *
     * @param left {Integer|String} Left position as number or string
     * @param top {Integer|String} Top position as number or string
     * @return {Map} left and top as numbers
     */
    __getPosition : function(left, top) {
      if (typeof(left) == "number" && typeof(top) == "number") {
        return {
          left: left,
          top: top
        };
      }
      
      left = left.toString().split("%");
      top = top.toString().split("%");
      
      if (left.length + top.length > 2) {
        var posInfo = this._widget.getPositionInfo();
        
        left = Math.round(posInfo.width * (left[0] / 100.0));
        top = Math.round(posInfo.height * (top[0] / 100.0));
      }
      
      return {
        left: parseInt(left, 10),
        top: parseInt(top, 10)
      };
    },

    _setup : function() {
      var from = this.__resetPoint = this._widget.getStyle("transform");
      
      var matcher = new RegExp("translate(?:3d)?([^)]+)");
      var parsed = matcher.exec(from);
      var mod;
      if (parsed && parsed.length == 2) {
        var vals = parsed[1].substring(1).split(",");
        var pos = this.__getPosition(vals[0], vals[1]);
        mod = this.__mod = {
          top: pos.top,
          left: pos.left
        };
      } else {
        mod = this.__mod = {
          top: 0,
          left: 0
        };
      }
    },
    
    _reset : function(value) {
      this._widget.setStyle({
        transform: value||""
      });
    },
    
    _getResetValue : function() {
      return this.__resetPoint;
    },
    
    _render : function(percent, now, render) {
      if (!render) {
        return;
      }

      var mod = this.__mod;
      var anim = this.__anim;
      if (!anim) {
        var to = this.getValue();
        var toPos = this.__getPosition(to.left, to.top);
        anim = this.__anim = {
          top: toPos.top - mod.top,
          left: toPos.left - mod.left
        };
        this.addListenerOnce("stop", function() {
          this.__anim = null;
        }, this);
      }

      var left = Math.round(mod.left + (anim.left * percent));
      var top = Math.round(mod.top + (anim.top * percent));

      this._widget.setStyle({
        transform: unify.bom.Transform.accelTranslate(left+"px", top+"px")
      });
    }
  }
});