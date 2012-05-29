core.Module("unify.ui.core.Util", {
  getWidgetLocation : function(widget) {
    return lowland.bom.Element.getLocation(widget.getElement());
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