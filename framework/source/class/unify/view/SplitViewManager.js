qx.Class.define("unify.view.SplitViewManager",
{
  extend : qx.core.Object,
  
  construct : function(mainViewManager, detailViewManager)
  {
    this.base(arguments);
    
    var elem = this.__element = document.createElement("div");
    elem.className = "split-view";

    this.__mainViewManager = mainViewManager;
    this.__detailViewManager = detailViewManager;

    elem.appendChild(mainViewManager.getElement());
    elem.appendChild(detailViewManager.getElement());
  },
  
  properties :
  {
    
  },
  
  members :
  {

    
    getElement : function() {
      return this.__element;
    }
  }
});
