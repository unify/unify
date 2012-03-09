/* ***********************************************************************************************

    Kitchen Sink

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2012 Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * UI view
 */
core.Class("kitchensink.view.Dialog", {
  include : [unify.view.StaticView],

  construct : function() {
    unify.view.StaticView.call(this);
  },

  members : 
  {
    // overridden
    getTitle : function(type, param) {
      return "Dialog Elements";
    },

    
    // overridden
    _createView : function() {
      var container = new unify.ui.container.Scroll(new unify.ui.layout.VBox(20));
      container.set({
        width: 500,
        alignX: "center",
        allowGrowX: false
      });
      this.add(container, {flex: 1});
      
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
            function() { this.debug("You have been alerted..."); }
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
              btnID = e.getData();
              if (btnID == 'YES') {
                this.debug("Good choice...");
              } else {
                this.debug("You ignorant fool! Watch this: http://www.youtube.com/watch?v=hQVTIJBZook");
              }
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

unify.core.Singleton.annotate(kitchensink.view.Dialog);
