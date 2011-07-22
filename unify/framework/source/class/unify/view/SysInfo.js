/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */

/**
 * Contains informations about the system and features.
 */
qx.Class.define("unify.view.SysInfo",
{
  extend : unify.view.ServiceView,
  type : "singleton",


  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
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
      var toolbar = new unify.ui.widget.container.ToolBar();
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
      
      var scrollview = this.__content = new unify.ui.widget.container.Scroll(new qx.ui.layout.VBox());
      scrollview.setEnableScrollX(false);
      
      var list = this.__content = new unify.ui.widget.container.List();
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
      
      /*console.log(data);
      var header, fields, title;
      for (header in data)
      {
        
        html += "<h2>" + header + "</h2>";
        html += "<ul>";

        fields = data[header];
        for (title in fields) {
          html += "<li><label>" + title + "</label><span>" + fields[title] + "</span></li>";
        }

        html += "</ul>";
      }

      this.__content.replace(html);
      this.__content.scrollTo(0, 0, false);*/
    }
  }
});