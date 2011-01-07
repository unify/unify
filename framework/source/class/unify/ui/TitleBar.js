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
qx.Class.define("unify.ui.TitleBar",
{
  extend : unify.ui.ToolBar,



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
    view.addListener("changeMaster", this.__onViewChangeMaster, this);

    this.__onViewChangeParent();
    this.__onViewChangeMaster();
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
      var parentView = this.getView().getParent();
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
