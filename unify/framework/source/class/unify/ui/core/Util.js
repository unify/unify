qx.Class.define("unify.ui.core.Util", {
  type: "static",
  
  statics : {
    getWidgetLocation : function(widget) {
      var origPos = qx.bom.element.Location.get(widget.getElement());
      var pos = {
        left: origPos.left,
        top: origPos.top
      };
      
      // Firefox don't calculate with transforms! So we have to calculate this and add it to position.
      if (qx.core.Environment.get("browser.name") == "firefox") {
        var parent = widget;
        var left = 0;
        var top = 0;

        while ((parent = parent.getLayoutParent())) {
          var transform = qx.bom.element.Style.get(parent.getElement(), "transform").split(",");
          if (transform && transform[0] != "none") {
            left += parseFloat(transform[4]);
            top += parseFloat(transform[5]);
          }
        }
        
        pos.left += left;
        pos.top += top;
      }
      
      return pos;
    },
    
    domElementToRootLevel : function(widget) {
      var e = widget.getElement();
      var pos = unify.ui.core.Util.getWidgetLocation(widget);
      
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