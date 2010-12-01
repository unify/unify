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
    view.addListener("changeParent", this.__onViewChangeParent, this);
    
    this.__onViewChangeParent();
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

    __onViewChangeParent : function(e)
    {
      var parentView = this.getView().getParent();
      var upElem = this.query("[rel=up]");
      
      if (parentView)
      {
        var upTitle = parentView.getTitle("up");
        
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
    view.removeListener("changeParent", this.__onViewChangeParent, this);    
  }
});
