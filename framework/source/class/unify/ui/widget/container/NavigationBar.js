/*
#asset(unify/*)
*/
qx.Class.define("unify.ui.widget.container.NavigationBar", {
  extend: unify.ui.widget.container.Composite,
  
  construct : function(view) {
    this.base(arguments, new unify.ui.widget.layout.NavigationBar());
    
    if (!view || !(view instanceof unify.view.StaticView)) {
      throw new Error("Invalid view! NavigationBar must be attached to a view!")
    }
    
    this.__view = view;
    
    var title = this.__title = new unify.ui.widget.basic.Label();
    title.setStyle({
      font: "Arial 20px bold",
      color: "white",
      textShadow: "rgba(0, 0, 0, 0.4) 0px -1px 0",
      textOverflow: "ellipsis"
    });
    this._add(title, {
      position: "title"
    });
    
    this.setStyle({
      background: "url(" + qx.util.ResourceManager.getInstance().toUri("unify/iphoneos/navigation-bar/black/navigationbar.png") + ")"
    });
    
    // Finally listen for any changes occour after creation of the titlebar
    view.addListener("changeTitle", this.__onViewChangeTitle, this);
    view.addListener("changeParent", this.__onViewChangeParent, this);
    view.addListener("changeMaster", this.__onViewChangeMaster, this);
    
    this.__onViewChangeTitle();
  },
  
  properties : {
    minWidth: {
      refine: true,
      init: 200
    },
    height: {
      refine: true,
      init: 42
    },
    
    appearance : {
      refine : true,
      init: "toolbar.navigationbar"
    }
  },
  
  members : {
    __view : null,
    __title : null,
    __parentButton : null,
    __masterButton : null,

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
      var parent = this.__view.getParent();
      
      var parentButton = this.__parentButton;
      if (parent && !parentButton) {
        parentButton = this.__parentButton = new unify.ui.widget.form.Button();
        parentButton.setRelation("parent");
        this._addAt(parentButton, 0, {
          position: "left"
        });
      }
      
      if (parent) {
        parentButton.setValue(parent.getTitle("parent"));
        parentButton.setVisibility("visible");
      } else if (parentButton) {
        parentButton.setVisibility("excluded");
      }
    },


    /**
     * Event listener for master changes
     *
     * @param e {qx.event.type.Data} Data event
     */
    __onViewChangeMaster : function(e)
    {
      var master = this.__view.getMaster();
      var masterButton = this.__masterButton;
      
      if (!masterButton && masterButton) {
        masterButton = this.__masterButton = new unify.ui.widget.form.Button();
        masterButton.setRelation("parent");
        this._addAt(masterButton, 0, {
          position: "left"
        });
      }
      
      if (master) {
        masterButton.setShow(master.getId());
        var currentMasterView=master.getCurrentView();
        masterButton.setValue(currentMasterView?currentMasterView.getTitle("parent") : "");
        masterButton.setVisibility("visible");
      } else if (masterButton) {
        masterButton.setVisibility("excluded");
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
    view = this.__view = null;
    this.__navigationBar.dispose();
    this.__navigationBar = null;
  }
});
