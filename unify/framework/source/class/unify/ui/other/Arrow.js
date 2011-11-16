qx.Class.define("unify.ui.other.Arrow", {
  extend: unify.ui.core.Widget,
  
  properties : {
    direction : {
      check : ["left", "top", "right", "bottom"],
      init: "left",
      apply: "_applyDirection"
    }
  },
  
  members : {
    __arrowSpan : null,
    
    _createElement : function() {
      var e = document.createElement("div");
      
      var arrowSpan = this.__arrowSpan = document.createElement("span");
      e.appendChild(arrowSpan);
      
      qx.bom.element.Style.setStyles(arrowSpan, {
        display: "block",
        width: "38px",
        height: "38px",
        backgroundColor: "#333",
        transform: "rotate(45deg) scale(0.73)",
        left: "2px",
        position: "absolute"
      });
      
      return e;
    },
    
    _applyDirection : function(value) {
      var rotate = null;
      if (value == "top") {
        rotate = "rotate(90deg) translate(-10px,-10px)";
      } else if (value == "bottom") {
        rotate = "rotate(-90deg) translate(-10px,10px)";
      } else if (value == "right") {
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