qx.Class.define("unify.view.mobile.SplitViewManager",
{
  extend : qx.core.Object,
  
  construct : function(mainViewManager, detailViewManager)
  {
    this.base(arguments);
    
    this.debug("Init SplitView...");
    
    this.__mainViewManager = mainViewManager;
    this.__detailViewManager = detailViewManager;
  },
  
  members :
  {
    
  }
});
