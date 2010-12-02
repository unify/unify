qx.Class.define("unify.view.SplitViewManager",
{
  extend : qx.core.Object,
  
  construct : function(mainViewManager, detailViewManager)
  {
    this.base(arguments);
    
    this.__mainViewManager = mainViewManager;
    this.__detailViewManager = detailViewManager;
  },
  
  members :
  {
    getElement : function() 
    {
      var elem = this.__element;
      if (!elem)
      {
        var elem = this.__element = document.createElement("div");
        elem.className = "split-view";

        var main = this.__mainViewManager;
        var detail = this.__detailViewManager;

        elem.appendChild(main.getElement());
        elem.appendChild(detail.getElement());
      }
      
      return elem;
    }
  }
});
