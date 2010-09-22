/* ***********************************************************************************************

    Unify Project
    
    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
qx.Class.define("tweet.view.desktop.Search",
{
  extend : tweet.view.desktop.Abstract,
  type : "singleton",
  
  members : 
  {
    __requestId : null,
	
    _createView : function()
    {
      var page = this.build(
      {
        create : qx.ui.tabview.Page,

        set :
        {
          label : "Search",
          icon : "qx/icon/Tango/32/actions/system-search.png"
        },

        layout :
        {
          create : qx.ui.layout.VBox,
          set : {
            spacing : 10
          }
        },

        add :
        [
          {
            create : qx.ui.container.Composite,

            id : "searchBox",

            layout :
            {
              create : qx.ui.layout.HBox,
              set :
              {
                spacing : 6,
                alignY : "middle"
              }
            },

            add :
            [
              {
                create : qx.ui.form.TextField,
                id : "searchField",
                position : {
                  flex : 1
                },
                listen : [
                  { event : "keypress" }
                ]
              },

              {
                create : qx.ui.form.Button,
                set : {
                  label : "Search"
                },
                id : "searchButton",
                listen : [
                  { event : "execute" }
                ]
              }
            ]
          },

          {
            create : tweet.ui.desktop.List,
            id : "list",
            position : {
              flex : 1
            }
          }
        ]
      });
      
      var TwitterAnon = tweet.business.TwitterAnon.getInstance();
      TwitterAnon.addListener("completed", this._onTwitterCompleted, this);    
      
      return page;
    },
    
    _onTwitterCompleted : function(e)
    {
      // Verify request ID
      if (this.__requestId != e.getId()) {
        return;
      }

      // Retrieve data
      var data = e.getData().results;

      // Reset enabled status
      this.getById("searchBox").resetEnabled();

      // Find list
      var list = this.getById("list");
      
      // Clear list
      list.removeAll();

      // Fill list with new content
      for (var i=0, l=data.length; i<l; i++) {
        list.add(new tweet.ui.desktop.Item(data[i]));
      }
    },
    
    _onSearchButtonExecute : function(e)
    {
      this.getById("searchBox").setEnabled(false);
      var value = encodeURIComponent(this.getById("searchField").getValue());

			var TwitterAnon = tweet.business.TwitterAnon.getInstance();
      this.__requestId = TwitterAnon.get("search", {query:value});
    },

    _onSearchFieldKeypress : function(e)
    {
      if (e.getKeyIdentifier() === "Enter") {
        this._onSearchButtonExecute(e);
      }
    }        
  }  
});
