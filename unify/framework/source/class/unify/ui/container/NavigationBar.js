/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2010, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * EXPERIMENTAL
 */
core.Class("unify.ui.container.NavigationBar", {
  include : [unify.ui.container.Bar, unify.ui.core.MChildControl],

  /**
   * @param view {unify.view.StaticView} View the navigation bar is attached to
   */
  construct : function(view, layout) {
    unify.ui.container.Bar.call(this);
    unify.ui.core.MChildControl.call(this);
    
    this._setLayout(layout || new unify.ui.layout.special.NavigationBar());

    if (!view) {
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
    appearance : {
      init: "navigationbar"
    }
  },

  members : {
    __view : null,
    __title : null,
    __parentButton : null,
    __masterButton : null,

    /**
     * Creates title widget
     *
     * @return {unify.ui.core.Widget} Title widget
     */
    _createTitleWidget : function() {
      var title = new unify.ui.basic.Label();
      title.setAppearance("navigationbar.title");
      title.setAutoCalculateSize(true);

      return title;
    },

    _createItemElement : function(config){
      var item = unify.ui.container.Bar.prototype._createItemElement.call(this, config);
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
     * @param e {Event} Data event
     */
    __onViewChangeParent : function(e)
    {
      var parentElem = this.getChildControl("parent");
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
     * @param e {Event} Data event
     */
    __onViewChangeMaster : function(e)
    {
      var masterElem = this.getChildControl("master");
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
     * Returns child control widget identified by id
     *
     * @param id {String} ID of child widget
     * @return {unify.ui.core.Widget} Content widget
     */
    _createChildControlImpl : function(id) {
      var control;

      if (id == "master") {
        control = this._createItemElement({rel:"master",kind:"button"});
        this._add(control, {
          position: "left"
        });
      } else if (id == "parent") {
        control = this._createItemElement({rel:"parent",kind:"button"});
        this._add(control, {
          position: "left"
        });
      }

      return control || unify.ui.container.Bar.prototype._createChildControlImpl.call(this, id); 
    },


    /**
     * Event listner for <code>changeTitle</code> event of attached view.
     *
     * @param e {Event} Property change event
     */
    __onViewChangeTitle : function(e) {
      this.__title.setValue(this.__view.getTitle());
    }
  }/* TODO: ,

  destruct : function() {
    var view = this.__view;
    view.removeListener("changeTitle", this.__onViewChangeTitle, this);
    view.removeListener("changeParent", this.__onViewChangeParent, this);
    view.removeListener("changeMaster", this.__onViewChangeMaster, this);
    this.__view = this.__title= this.__parentButton = this.__masterButton = null;
  }*/
});
