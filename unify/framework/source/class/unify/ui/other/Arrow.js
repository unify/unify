/*
===============================================================================================

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com

===============================================================================================
*/

/**
 * Arrow widget, mainly used in overlay
 */
core.Class("unify.ui.other.Arrow", {
  include: [unify.ui.core.Widget],
  
  properties : {
    /** Direction of arrow */
    direction : {
      type : ["left", "top", "right", "bottom"],
      init: "top",
      apply: function(value, old) { this._applyDirection(value, old); }
    },

    /** {Map[]} Speacial css styles for arrow element */
    arrowStyle : {
      apply: function(value, old) { this._applyArrowStyle(value, old); }
    }
  },
  
  construct : function() {
    unify.ui.core.Widget.call(this);
  },
  
  members : {
    /** Arrow DOM element */
    __arrowSpan : null,
    
    // overridden
    _createElement : function() {
      var e = document.createElement("div");
      
      var arrowSpan = this.__arrowSpan = document.createElement("span");
      core.bom.Style.set(arrowSpan,{display:"block",position:"absolute"});
      e.appendChild(arrowSpan);
      
      return e;
    },
    
    _applyArrowStyle : function(value) {
      var arrowSpan = this.__arrowSpan;
      if (arrowSpan) {
        core.bom.Style.set(arrowSpan, value);
      }
    },

    _applyDirection : function(value) {
      var rotate = null;
      if (value == "right") {
        rotate = "rotate(90deg)";
      } else if (value == "left") {
        rotate = "rotate(-90deg)";
      } else if (value == "bottom") {
        rotate = "rotate(180deg)";
      }
      
      if (rotate) {
        this.setStyle({
          transform: rotate
        });
      }
    }
  }
});