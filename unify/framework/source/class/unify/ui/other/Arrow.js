/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * Arrow widget, mainly used in overlay
 */
qx.Class.define("unify.ui.other.Arrow", {
  extend: unify.ui.core.Widget,
  
  properties : {
    /** Direction of arrow */
    direction : {
      check : ["left", "top", "right", "bottom"],
      init: "top",
      apply: "_applyDirection"
    },

    /** {Map[]} Speacial css styles for arrow element */
    arrowStyle : {
      apply: "_applyArrowStyle",
      dereference : true
    }
  },
  
  members : {
    /** Arrow DOM element */
    __arrowSpan : null,
    
    // overridden
    _createElement : function() {
      var e = document.createElement("div");
      
      var arrowSpan = this.__arrowSpan = document.createElement("span");
      qx.bom.element.Style.setStyles(arrowSpan,{display:"block",position:"absolute"});
      e.appendChild(arrowSpan);
      
      return e;
    },
    
    _applyArrowStyle : function(value) {
      var arrowSpan = this.__arrowSpan;
      if (arrowSpan) {
        qx.bom.element.Style.setStyles(arrowSpan, value);
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
  },
  
  destruct: function(){
    this.__arrowSpan=null;
  }
});