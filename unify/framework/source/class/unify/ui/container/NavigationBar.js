/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2010, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * EXPERIMENTAL
 */

/*
#asset(unify/*)
*/
qx.Class.define("unify.ui.container.NavigationBar", {
  extend: unify.ui.container.Bar,

  /**
   * @param view {unify.view.StaticView} View the navigation bar is attached to
   */
  construct : function(view) {
    this.base(arguments);
    this._setLayout(new unify.ui.layout.special.NavigationBar());

    if (!view || !(view instanceof unify.view.StaticView)) {
      throw new Error("Invalid view! NavigationBar must be attached to a view!")
    }

    this.__view = view;

    var title = this.__title = this._createTitleWidget();
    this._add(title, {
      position: "title"
    });

    // Finally listen for any changes occour after creation of the titlebar
    view.addListener("changeTitle", this.__onViewChangeTitle, this);
    view.addListener("changeParent", this.__onViewChangeParent, this);
    var master=view.getManager().getMaster();
    if(master){
      master.addListener("changeView",this.__onViewChangeMaster,this);
      master.addListener("changeDisplayMode",this.__onViewChangeMaster,this);
    }

    this.__onViewChangeTitle();
    this.__onViewChangeParent();
    this.__onViewChangeMaster();
  },

  properties : {
    minWidth: {
      refine: true,
      init: 200
    },
    height: {
      refine: true,
      init: 44
    },

    appearance : {
      refine : true,
      init: "navigationbar"
    }
  },

  members : {
    __view : null,
    __title : null,
    __parentButton : null,
    __masterButton : null,

    _createTitleWidget : function() {
      var title = new unify.ui.basic.Label();
      title.setAppearance("navigationbar.title");

      return title;
    },

    _createItemElement : function(config){
      var item = this.base(arguments,config);
      var rel=config.rel;

      //TODO required? parent and master should be the same layout as all the others
      if(rel=='parent'||rel=='master'){
        item.setHeight(28);
        item.setAllowGrowY(false);
        item.setAllowShrinkY(false);
      }

      return item;
    },

    /*
    ---------------------------------------------------------------------------
      EVENT LISTENER
    ---------------------------------------------------------------------------
    */

    /**
     * Event listener for parent changes
     *
     * @param e {qx.event.type.Data} Data event
     */
    __onViewChangeParent : function(e)
    {
      var parentElem = this.__parentButton;
      if (!parentElem)
      {
        parentElem = this.__parentButton = this._createItemElement({rel:"parent",kind:"button"});
        //parentElem.setStyle(unify.ui.styling.StaticTheme.navigationBarButtonParent);
        this._add(parentElem, {
          position: "left"
        });
      }

      var parent = this.__view.getParent();
      if(parent){
        this._setItemLabel(parentElem,parent.getTitle("parent"));
        parentElem.setVisibility("visible");
      } else {
        parentElem.setVisibility("excluded");
        this._setItemLabel(parentElem,"");
      }
    },


    /**
     * Event listener for master changes
     *
     * @param e {qx.event.type.Data} Data event
     */
    __onViewChangeMaster : function(e)
    {
      var masterElem = this.__masterButton;
      if (!masterElem)
      {
        masterElem = this.__masterButton =this._createItemElement({rel:"master",kind:"button"});
        //masterElem.setStyle(unify.ui.styling.StaticTheme.navigationBarButton);
        this._add(masterElem, {
          position: "left"
        });
      }
      var master = this.__view.getManager().getMaster();

      if(master && master.getDisplayMode()=='popover'){
        masterElem.setShow(master.getId());
        var currentMasterView=master.getCurrentView();
        this._setItemLabel(masterElem,currentMasterView?currentMasterView.getTitle("parent") : "missing title");
        masterElem.setVisibility("visible");
      } else {
        masterElem.setVisibility("excluded");
        this._setItemLabel(masterElem,"");
      }
    },


    /**
     * Event listner for <code>changeTitle</code> event of attached view.
     *
     * @param e {qx.event.type.Data} Property change event
     */
    __onViewChangeTitle : function(e) {
      this.__title.setValue(this.__view.getTitle());
    }
  },

  destruct : function() {
    var view = this.__view;
    view.removeListener("changeTitle", this.__onViewChangeTitle, this);
    view.removeListener("changeParent", this.__onViewChangeParent, this);
    view.removeListener("changeMaster", this.__onViewChangeMaster, this);
    this.__view = this.__title= this.__parentButton = this.__masterButton = null;
  }
});
