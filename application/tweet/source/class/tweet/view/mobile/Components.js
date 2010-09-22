/* ***********************************************************************************************

    Unify Project
    
    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/**
 * Start screen (top level menu)
 */
qx.Class.define("tweet.view.mobile.Components",
{
  extend : unify.view.mobile.StaticView,
  type : "singleton",

  members :
  {
    /*
    ---------------------------------------------------------------------------
      VIEW INTERFACE
    ---------------------------------------------------------------------------
    */

    // overridden
    getTitle : function(type, param) {
      return "Components";
    },    

    saveToStore : function() {
      var storeInput = this.getLayer().query("#storetest input");
      console.log("Save to store...");
      unify.io.DataStore.save({key:"eintrag",val:storeInput.value}, function() {
        console.log("entry saved...");
      });
    },
    
    // overridden
    _createView : function() 
    {
      var layer = new unify.ui.mobile.Layer(this);      

      var titlebar = new unify.ui.mobile.TitleBar(this);
      layer.add(titlebar);
      
      var content = new unify.ui.mobile.ScrollView();
      content.setEnableScrollX(false);
      layer.add(content);

      var html = '<ul>';
      html += '<li id="doDialog"><label>Dialog</label><hr/></li>';
      html += '<li id="doAlertDialog"><label>Alert Dialog</label><hr/></li>';
      html += '</ul>';             
      content.add(html);
      
      var slider = new unify.ui.mobile.SlideView();
      content.add(slider);
      slider.add('<div>1st</div><div>2nd</div><div>3rd</div>');
      
      html = '<div id="storetest">';
      html +=   '<input type="text" />';
      html +=   '<button exec="saveToStore">Speichern</button>';
      html += '</div>';
      content.add(html);
      
      var input = content.query("#storetest input");
      unify.io.DataStore.get("eintrag", function(obj) {
        console.log("Load: ", obj);
        if (obj) {
          input.value = obj.val;
        }
      });

      var Registration = qx.event.Registration;
      Registration.addListener(layer.query("#doDialog"), "tap", function() {
        var dialog = new unify.ui.mobile.dialog.Dialog();
        dialog.add("<button>Reply</button>");
        dialog.add("<button>Forward</button>");
        dialog.add("<button class=\"close\">Cancel</button>");
        dialog.show();
      });
    
      Registration.addListener(layer.query("#doAlertDialog"), "tap", function() {
        unify.ui.mobile.dialog.Alert.start(
          "<div>Das ist ein Test</div>",
          "<div>Das ist ein Test Das ist ein Test Das ist ein Test Das ist ein Test</div>",
          "<button class=\"close\">OK</button>",
          "<button class=\"close\">Cancel</button>"
        );
      });
        
      return layer;
    }     
  }
});
