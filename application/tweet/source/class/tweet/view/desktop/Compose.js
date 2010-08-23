qx.Class.define("tweet.view.desktop.Compose",
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
        id : "composeView",

        set :
        {
          label : this.tr("Write"),
          icon : "qx/icon/Tango/32/apps/utilities-text-editor.png"
        },

        layout :
        {
          create : qx.ui.layout.Grid,
          set :
          {
            spacingX : 10,
            spacingY : 10
          }
        },

        add :
        [
          {
            create : qx.ui.basic.Label,
            set : {
              value : this.tr("What are you doing?")
            },
            position :
            {
              row : 0,
              column : 0
            }
          },

          {
            create : qx.ui.basic.Label,
            id : "countdown",
            set : {
              value : "140"
            },
            position :
            {
              row : 0,
              column : 1
            }
          },

          {
            create : qx.ui.form.TextArea,
            id : "composeField",
            set : {
              liveUpdate : true
            },
            listen : [
              { event : "changeValue" }
            ],
            position :
            {
              row : 1,
              column : 0,
              colSpan : 2
            }
          },

          {
            create : qx.ui.form.Button,
            id : "composeSendButton",
            set : {
              label : this.tr("Update"),
              allowGrowX : false
            },
            listen : [
              { event : "execute" }
            ],
            position :
            {
              row : 2,
              column : 1
            }
          }
        ]
      });

      // TODO, How to set these without setters?
      var layout = this.getById("composeView").getLayout();
      layout.setColumnAlign(1, "right", "middle");
      layout.setColumnFlex(1, 1); 
      
      var TwitterAuth = tweet.business.TwitterAuth.getInstance();
      TwitterAuth.addListener("completed", this._onTwitterCompleted, this);       
      
      return page;     
    },
    
    _onComposeSendButtonExecute : function(e)
    {
      this.getById("composeField").setEnabled(false);
      var data = "status=" + encodeURIComponent(this.getById("composeField").getValue());
      this.__requestId = tweet.business.TwitterAuth.getInstance().post("send", null, data);
    },

    _onComposeFieldChangeValue : function(e) {
      this.getById("countdown").setValue("" + (140 - (e.getData()||"").length));
    },
    
    _onTwitterCompleted : function(e)
    {
      // Verify request ID
      if (this.__requestId != e.getId()) {
        return;
      }
  
      // Update GUI
      this.getById("composeField").resetEnabled();
      this.getById("composeField").resetValue();        
      this.getById("countdown").setValue("140");
      
      // Reload lists
      var TwitterAuth = tweet.business.TwitterAuth.getInstance();
      TwitterAuth.get("updates");
      TwitterAuth.get("sent");
    }    
  }  
});
