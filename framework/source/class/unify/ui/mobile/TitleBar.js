/* ***********************************************************************************************

    Unify Project
    
    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/**
 * The TitleBar may be used as the first control of the {@link Layer}
 * for showing a title and offering simple navigation options. As the {@link ToolBar}
 * it might show additional buttons on the right side for navigation proposes.
 */
qx.Class.define("unify.ui.mobile.TitleBar",
{
  extend : unify.ui.mobile.ToolBar,



  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  construct : function(view)
  {
    this.base(arguments, view);
    
    // Configure titlebar on current configuration of view
    this.query(".center").innerHTML = view.getTitle("titlebar");
    
    // Finally listen for any changes occour after creation of the titlebar
    view.addListener("changeTitle", this.__onViewChangeTitle, this);
    view.addListener("changeActive", this.__onViewChangeActive, this);
  },



  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /*
    ---------------------------------------------------------------------------
      INTERNALS
    ---------------------------------------------------------------------------
    */
    
    // overridden
    _cssClassName : "title-bar",
    
        
        
    /*
    ---------------------------------------------------------------------------
      EVENT LISTENER
    ---------------------------------------------------------------------------
    */    
    
    __lastUpTitle : null,
    
    /**
     * Event listner for <code>changeActive</code> event of attached view.
     * 
     * @param e {qx.event.type.Data} Property change event
     */        
    __onViewChangeActive : function(e)
    {
      if (!e.getData()) {
        return;
      }
      
      var NavigationManager = unify.view.mobile.NavigationManager.getInstance();
      var path = NavigationManager.getPath();
      var upElem = this.query("[rel=up]");
      
      // Whether there is a parent
      if (path.getSize() > 1) 
      {
        var ViewManager = unify.view.mobile.ViewManager.getInstance();
        var upTitle = ViewManager.getById(path.getView(-1)).getTitle("up", path.getParam(-1));
        
        if (this.__lastUpTitle != upTitle)
        {
          if (upElem)
          {
            upElem.innerHTML = upTitle;
            upElem.style.display = "";
          }
          else
          {
            this.add(
            {
              label : upTitle,
              target : "left",
              rel : "up"
            });      
          }
          
          this.__lastUpTitle = upTitle;
          
          // Send update request to ToolBar
          this._syncLayout("left");          
        }
      }
      else
      {
        if (upElem) {
          upElem.style.display = "none";
        }
        
        this.__lastUpTitle = null;
      }
    },
        
    
    /**
     * Event listner for <code>changeTitle</code> event of attached view.
     * 
     * @param e {qx.event.type.Data} Property change event
     */    
    __onViewChangeTitle : function(e) 
    {
      this.query(".center").innerHTML = this.getView().getTitle();
      
      // Send update request to ToolBar
      this._syncLayout("center");
    }
  },
  
  
  
  /*
  *****************************************************************************
     DESTRUCTOR
  *****************************************************************************
  */
  
  destruct : function()
  {
    var view = this.__view
    view.removeListener("changeTitle", this.__onViewChangeTitle, this);
    view.removeListener("changeActive", this.__onViewChangeActive, this);
  }
});
