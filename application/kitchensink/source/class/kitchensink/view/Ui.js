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
      var container = new unify.ui.container.Scroll(new unify.ui.layout.VBox(20)).set({
        width: 500,
        alignX: "center",
        allowGrowX: false
      });
      this.add(container, {flex: 1});
      
      var label = new unify.ui.basic.Label("Label");
      container.add(label);
      
      var button = new unify.ui.form.Button("Button");
      container.add(button);
      
      // ComboBox -----------------------------------------------------------
      var combobox = new unify.ui.form.Combobox().set({
        width: 300,
        allowGrowX: false
      });
      combobox.setData([{
        id: 1,
        label: "Test Value Number 1"
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
      
      // CheckBox -----------------------------------------------------------
      var checkbox = new unify.ui.form.CheckBox("Checkbox <default").set({
        width: 300,
        allowGrowX: false
      });
      container.add(checkbox);
      
      var checkboxChecked = new unify.ui.form.CheckBox("Checkbox <checked>", true).set({
        width: 300,
        allowGrowX: false
      });
      container.add(checkboxChecked);
      
      // Show Empty Dialog --------------------------------------------------
      var dialogButton = new unify.ui.form.Button("Dialog");
      dialogButton.addListener("execute", this.__openDialog, this);
      container.add(dialogButton);
      
      // Show Alert message ------------------------------------------------
      var alertButton = new unify.ui.form.Button("Alert");
      alertButton.addListener("execute", function(e) {
        unify.ui.dialog.Dialog.alert(
            "Alert", 
            "Be Alert!", 
            function() { console.log("You have been alerted..."); }
          );
        }, this);
      container.add(alertButton);
      
      // Show Confirm Dialog ------------------------------------------------
      var confirmButton = new unify.ui.form.Button("Confirm");
      confirmButton.addListener("execute", function(e) {
        unify.ui.dialog.Dialog.confirm(
            "Please deside...",
            "Witch programming language is the best?",
            "JavaScript", 
            "VisualBasic",
            function(e) { 
              var btnID = e.getData();
              if (btnID == 'YES')
                console.log("Good choice...")
              else
                console.log("You ignorant fool! Watch this: http://www.youtube.com/watch?v=hQVTIJBZook")
            }
          );
        }, this);
      container.add(confirmButton);
      
      // Open modal view
      var openModalButton = new unify.ui.basic.NavigationButton("Modal");
      openModalButton.set({
        goTo: "modal"
      });
      container.add(openModalButton);
      
      // Open activity indicator
      var startActivityIndicator = new unify.ui.form.Button("Activity indicator");
      startActivityIndicator.addListener("execute", function() {
        unify.ui.manager.ActivityIndicatorManager.getInstance().show();
        
        window.setTimeout(function() {
          unify.ui.manager.ActivityIndicatorManager.getInstance().hide();
        }, 3000);
      }, this);
      container.add(startActivityIndicator);
      
      var textfield = new unify.ui.form.TextField();
      container.add(textfield);
    },
    
    __dialog : null,
    
    __openDialog : function() {
      var dialog = this.__dialog = new unify.ui.dialog.GenericDialog("Das ist der Titel", []);
      dialog.addListener("execute", this.__onDialogExecute, this);
      
      unify.ui.core.PopOverManager.getInstance().show(dialog, "center");
    },
    
    __onDialogExecute : function(e) {
      this.debug("Dialog action : " + e.getData());
      
      unify.ui.core.PopOverManager.getInstance().hide(this.__dialog);
    }
    
  }
});
