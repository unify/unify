qx.Class.define("unify.ui.core.Util", {
  type: "static",
  
  statics : {
    domElementToRootLevel : function(widget) {
      var e = widget.getElement();
      var pos = qx.bom.element.Location.get(e);
      
      var posSave = {
        originalPosition : {
          left: qx.bom.element.Style.get(e, "left"),
          top: qx.bom.element.Style.get(e, "top"),
          zIndex: qx.bom.element.Style.get(e, "zIndex")
        },
        newPosition : {
          left: pos.left,
          top: pos.top,
          zIndex: 20000
        }
      };
      
      widget.setUserData("domElementPositionOverride", posSave);
      
      var rootElement = qx.core.Init.getApplication().getRoot().getElement();
      qx.bom.element.Style.setStyles(e, {
        left: pos.left,
        top: pos.top,
        zIndex: 20000
      });
      
      rootElement.appendChild(e);
    },
    
    domElementToTreeLevel : function(widget) {
      var e = widget.getElement();
      var posOverride = widget.getUserData("domElementPositionOverride");
      
      if (!posOverride) {
        return;
      }
      
      var origPos = posOverride.originalPosition;
      
      var parentElement = widget.getLayoutParent().getContentElement();
      qx.bom.element.Style.setStyles(e, {
        left: origPos.left,
        top: origPos.top,
        zIndex: origPos.zIndex
      });
      parentElement.appendChild(e);
      
      widget.setUserData("domElementPositionOverride", null);
    }
  }
});