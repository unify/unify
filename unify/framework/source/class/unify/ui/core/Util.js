core.Module("unify.ui.core.Util", {
  getWidgetLocation : function(widget) {
    return lowland.bom.Element.getLocation(widget.getElement());
  },
  
  domElementToRootLevel : function(widget) {
    var posOverride = widget.getUserData("domElementPositionOverride");
    
    if (posOverride) {
      return;
    }
    
    var e = widget.getElement();
    var pos = unify.ui.core.Util.getWidgetLocation(widget);
    
    var origPos = widget.getPosition();

    var posSave = {
      originalPosition : {
        left: origPos[0],
        top: origPos[1],
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
      left: pos.left + "px",
      top: pos.top + "px",
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
      left: origPos.left + "px",
      top: origPos.top + "px",
      zIndex: origPos.zIndex
    });
    parentElement.appendChild(e);
    
    widget.setUserData("domElementPositionOverride", false);
  }
});