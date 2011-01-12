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
qx.Class.define("unify.ui.NavigationBar",
{
  extend : unify.ui.Abstract,



  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  /**
   * @param view {unify.view.Static} View controller to connect to
   */
  construct : function(view)
  {
    this.base(arguments);

    if (!view || !(view instanceof unify.view.StaticView)) {
      throw new Error("Invalid view! NavigationBar must be attached to a view!")
    }
    
    this.__view = view;

    // Finally listen for any changes occour after creation of the titlebar
    view.addListener("changeTitle", this.__onViewChangeTitle, this);
    view.addListener("changeParent", this.__onViewChangeParent, this);
    view.addListener("changeMaster", this.__onViewChangeMaster, this);

    this.__onViewChangeParent();
    this.__onViewChangeMaster();
  },



  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */
  
  properties :
  {
    leftItem : 
    {
      nullable : true
    },
    
    rightItem :
    {
      nullable : true
    }
  },
  
  members :
  {
    _createElement : function()
    {
      var elem = document.createElement("div");
      elem.className = "navigation-bar";
      
      var titleElem = this.__titleElem = document.createElement("h1");
      titleElem.innerHTML = this.__view.getTitle();
      elem.appendChild(titleElem);
      
      var leftElem = this.__leftElem = document.createElement("div");
      leftElem.className = "left";
      elem.appendChild(leftElem);
      
      var rightElem = this.__rightElem = document.createElement("div");
      rightElem.className = "right";
      elem.appendChild(rightElem);
      
      

      return elem;      
    },
    
    
    
    
    /*
    ---------------------------------------------------------------------------
      EVENT LISTENER
    ---------------------------------------------------------------------------
    */

    __lastParentTitle : null,
    __lastMasterTitle : null,

    /**
     * Event listener for parent changes
     *
     * @param e {qx.event.type.Data} Data event
     */
    __onViewChangeParent : function(e)
    {
      return;
      
      var parentView = this.__view.getParent();
      var parentButtonElem = this.query("[rel=parent]");

      if (parentView)
      {
        var parentTitle = parentView.getTitle("parent");

        if (this.__lastParentTitle != parentTitle)
        {
          if (parentButtonElem)
          {
            parentButtonElem.innerHTML = parentTitle;
            parentButtonElem.style.display = "";
          }
          else
          {
            this.add(
            {
              label : parentTitle,
              rel : "parent"
            });
          }

          this.__lastParentTitle = parentTitle;
        }
      }
      else
      {
        if (parentButtonElem) {
          parentButtonElem.style.display = "none";
        }

        this.__lastParentTitle = null;
      }
    },


    /**
     * Event listener for master changes
     *
     * @param e {qx.event.type.Data} Data event
     */
    __onViewChangeMaster : function(e)
    {
      return;
      
      var masterViewManager = this.getView().getMaster();
      var masterButtonElem = this.query("[rel=master]");

      if (masterViewManager)
      {
        var masterView = masterViewManager.getCurrentView();
        var masterTitle = masterView.getTitle("master");

        if (this.__lastMasterTitle != masterTitle)
        {
          if (masterButtonElem)
          {
            masterButtonElem.innerHTML = masterTitle;
            masterButtonElem.style.display = "";
          }
          else
          {
            this.add(
            {
              label : masterTitle,
              rel : "master"
            });
          }

          this.__lastMasterTitle = masterTitle;
        }
      }
      else
      {
        if (masterButtonElem) {
          masterButtonElem.style.display = "none";
        }

        this.__lastMasterTitle = null;
      }      
    },


    /**
     * Event listner for <code>changeTitle</code> event of attached view.
     *
     * @param e {qx.event.type.Data} Property change event
     */
    __onViewChangeTitle : function(e)
    {
      return;
      
      this.query(".center").innerHTML = this.getView().getTitle("titlebar");
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
