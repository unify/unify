/* ***********************************************************************************************

    Kitchen Sink

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2012 Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * UI view
 */
qx.Class.define("kitchensink.view.Ui", {
  extend : unify.view.StaticView,
  type : "singleton",

  members : 
  {
    // overridden
    getTitle : function(type, param) {
      return "UI Elements";
    },

    
    // overridden
    _createView : function() {
      var container = new unify.ui.container.Scroll(new unify.ui.layout.VBox());
      this.add(container, {flex: 1});
      
      var label = new unify.ui.basic.Label("Label");
      container.add(label);
      
      var button = new unify.ui.form.Button("Button");
      container.add(button);
      
      var combobox = new unify.ui.form.Combobox().set({
        width: 300,
        allowGrowX: false
      });
      combobox.setData([{
        id: 1,
        label: "Test1"
      }, {
        id: 2,
        label: "Test2"
      }, {
        id: 3,
        label: "Test3"
      }]);
      combobox.setValue(1);
      combobox.addListener("execute", function(e) {
        this.debug("COMBO BOX " + e.getData());
      }, this);
      container.add(combobox);
      
      var dialogButton = new unify.ui.form.Button("Open Dialog");
      dialogButton.addListener("execute", this.__openDialog, this);
      container.add(dialogButton);
    },
    
    __dialog : null,
    
    __openDialog : function() {
      var dialog = this.__dialog = new unify.ui.dialog.GenericDialog("Das ist der Titel", []);
      dialog.addListener("execute", this.__onDialogExecute, this);
      var overlay = dialog.getOverlay();
      
      unify.view.PopOverManager.getInstance().show(overlay);
    },
    
    __onDialogExecute : function(e) {
      this.debug("Dialog action : " + e.getData());
      
      unify.view.PopOverManager.getInstance().hide(this.__dialog.getOverlay());
    }
  }
});
