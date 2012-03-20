core.Module("unify.ui.core.Util", {
  getWidgetLocation : function(widget) {
    var origPos = lowland.bom.Element.getLocation(widget.getElement());
    var pos = {
      left: origPos.left,
      top: origPos.top
    };
    
    // Firefox don't calculate with transforms! So we have to calculate this and add it to position.
    if (core.Env.getValue("engine") == "gecko") {
      var parent = widget;
      var left = 0;
      var top = 0;

      while ((parent = parent.getParentBox())) {
        var transform = core.bom.Style.get(parent.getElement(), "transform").split(",");
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
        left: core.bom.Style.get(e, "left"),
        top: core.bom.Style.get(e, "top"),
        zIndex: core.bom.Style.get(e, "zIndex")
      },
      newPosition : {
        left: pos.left,
        top: pos.top,
        zIndex: 20000
      }
    };
    
    widget.setUserData("domElementPositionOverride", posSave);
    
    var rootElement = unify.core.Init.getApplication().getRoot().getElement();
    core.bom.Style.set(e, {
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
    
    var parentElement = widget.getParentBox().getContentElement();
    core.bom.Style.set(e, {
      left: origPos.left,
      top: origPos.top,
      zIndex: origPos.zIndex
    });
    parentElement.appendChild(e);
    
    widget.setUserData("domElementPositionOverride", null);
  }
});