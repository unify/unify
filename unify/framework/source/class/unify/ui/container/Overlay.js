// TODO : Implement it
qx.Class.define("unify.ui.container.Overlay", {
  extend : unify.ui.container.Composite,
  
  events : {
    "hidden" : "qx.event.type.Event",
    "shown" : "qx.event.type.Event"
  },
  
  properties : {
    // overridden
    appearance : {
      refine: true,
      init: "overlay"
    },
    
    enableAnimation : {
      init: true
    },
    
    arrow : {
      check : "boolean",
      init: false
    },
    
    arrowPosHorizontal : {
      check : ["left", "center", "right"],
      init : "left"
    },
    
    arrowPosVertical : {
      check : ["top", "middle", "bottom"],
      init : "top"
    }
  },
  
  construct : function() {
    this.base(arguments, new qx.ui.layout.Canvas());
  },
  
  members : {
    _createElement : function() {
      var e = this.base(arguments);
      
      var arrow = this.__arrow = document.createElement("div");
      var arrowSpan = document.createElement("span");
      
      var position = this.getArrowPosVertical().substring(0, 1) + this.getArrowPosHorizontal().substring(0, 1);
      
      if (position == "tl") {
        qx.bom.element.Style.setStyles(arrow, {
          position : "absolute",
          width: "34px",
          height : "15px",
          marginLeft : "5px",
          marginTop : "-20px",
          overflow : "hidden"
        });
        qx.bom.element.Style.setStyles(arrowSpan, {
          display: "block",
          width : "20px",
          height : "20px",
          WebkitTransform : "rotate(45deg) skew(-10deg, -10deg) translate(8px, 0)",
          backgroundColor : "#333"
        });
      } else if (position == "tc") {
        // TODO : Fix values
        qx.bom.element.Style.setStyles(arrow, {
          position : "absolute",
          width: "34px",
          height : "15px",
          marginLeft : "5px",
          marginTop : "-20px",
          overflow : "hidden"
        });
        qx.bom.element.Style.setStyles(arrowSpan, {
          display: "block",
          width : "20px",
          height : "20px",
          WebkitTransform : "rotate(45deg) skew(-10deg, -10deg) translate(8px, 0)",
          backgroundColor : "#333"
        });
      }
      
      arrow.appendChild(arrowSpan);
      e.appendChild(arrow);
      
      return e;
    },
    
    show : function() {
      this.setVisibility("visible");
      this.fireEvent("shown");
    },
    
    hide : function() {
      this.setVisibility("hidden");
      this.fireEvent("hidden");
    }
  }
});