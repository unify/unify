/*
===============================================================================================

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

===============================================================================================
*/

/**
 * Contains informations about the system and features.
 */
core.Class("unify.view.SysInfo",
{
  include : [unify.view.ServiceView],

  constuct : function() {
    unify.view.ServiceView.call(this);
  },

  /*
  ----------------------------------------------------------------------------
     MEMBERS
  ----------------------------------------------------------------------------
  */

  members :
  {
    __content : null,



    /*
    ---------------------------------------------------------------------------
      STATIC VIEW INTERFACE
    ---------------------------------------------------------------------------
    */

    // overridden
    getTitle : function(type) {
      return "System Info";
    },


    // overridden
    getDefaultSegment : function() {
      return "basics";
    },
    
    
    // overridden
    _createView : function()
    {
      var toolbar = new unify.ui.container.ToolBar();
      toolbar.setItems(
      [
        {
          kind : "segmented",
          view : this,
          position: "center",
          buttons :
          [
            { label : "Basics", segment : "basics" },
            { label : "Environment", segment : "env" },
            { label : "Features", segment : "features" }
          ]
        }
      ]);
      this.add(toolbar);
      
      var scrollview = this.__content = new unify.ui.container.Scroll(new unify.ui.layout.VBox());
      scrollview.setEnableScrollX(false);
      
      var list = this.__content = new unify.ui.container.List();
      scrollview.add(list, {
        flex: 1
      });
      
      this.add(scrollview, {
        flex: 1
      });
    },



    /*
    ---------------------------------------------------------------------------
      SERVICE VIEW INTERFACE
    ---------------------------------------------------------------------------
    */

    // overridden
    _getBusinessObject : function() {
      return unify.business.SysInfo.getInstance();
    },

    // overridden
    _getServiceName : function() {
      return this.getSegment();
    },

    // overridden
    _getRenderVariant : function() {
      return this.getSegment();
    },

    // overridden
    _renderData : function(data)
    {
      this.__content.setData(data);
    }
  }
});

unify.core.Singleton.annotate(unify.view.SysInfo);