/* ***********************************************************************************************

    Unify Project
    
    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/**
 * A single item inside a typical Twitter "tweet" list {@link List}.
 */
qx.Class.define("tweet.ui.desktop.Item",
{
  extend : qx.ui.core.Widget,



  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  /**
   * @param entry {Map} The model which contains all data of the entry.
   */
  construct : function(entry)
  {
    this.base(arguments);

    var layout = new qx.ui.layout.Grid;
    layout.setRowFlex(0, 1);
    layout.setColumnFlex(1, 1);
    this._setLayout(layout);

    if (entry != null) {
      this.setEntry(entry);
    }
  },



  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties :
  {
    // overridden
    appearance :
    {
      refine : true,
      init : "twitter-item"
    },

    /** The data to show inside the item */
    entry :
    {
      check : "Object",
      apply : "_applyEntry"
    }
  },




  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    // property apply
    _applyEntry : function(entry)
    {
      if (!entry) {
        return;
      }

      var Twitter = tweet.util.Twitter;
      var user = entry.from_user || entry.user.screen_name;

      this.getChildControl("icon").setSource(Twitter.getIcon(entry));
      this.getChildControl("message").setValue(user + " " + Twitter.getFormattedText(entry));
      this.getChildControl("date").setValue(Twitter.getFormattedDate(entry));
    },

    // overridden
    _createChildControlImpl : function(id)
    {
      var control;

      switch(id)
      {
        case "icon":
           control = new qx.ui.basic.Image();
           control.setScale(true);
           control.setWidth(40);
           control.setHeight(40);           
           this._add(control, {row:0, column:0 , rowSpan:2});
           break;

        case "message":
          control = new qx.ui.basic.Label();
          control.setRich(true);
          control.getContentElement().setAttribute("class", "message");
          this._add(control, {row:0, column:1});
          break;

        case "date":
          control = new qx.ui.basic.Label();
          this._add(control, {row:1, column:1});
          break;
      }

      return control || this.base(arguments, id);
    }
  }
});
