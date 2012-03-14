/* ***********************************************************************************************

    Kitchen Sink

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2012 Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * UI view
 */
core.Class("kitchensink.view.Ui", {
  include : [unify.view.StaticView],

  construct : function() {
    unify.view.StaticView.call(this);
  },

  members : 
  {
    // overridden
    getTitle : function(type, param) {
      return "UI Elements";
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
      
      var label = new unify.ui.basic.Label("Label");
      container.add(label);
      
      var button = new unify.ui.form.Button("Button");
      container.add(button);
      
      var combobox = new unify.ui.form.Combobox();
      combobox.set({
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
      
      var fileInput = new unify.ui.form.FileInput();
      fileInput.setValue("Please choose file");
      fileInput.set({
        minHeight: 50
      });
      fileInput.addListener("changeValue", function(e) {
        fileInput.setValue(e.getData()[0].fileName);
      });
      container.add(fileInput);
      
      var slider = new unify.ui.form.Slider();
      container.add(slider);

      // CheckBox -----------------------------------------------------------
      var checkbox = new unify.ui.form.CheckBox("Checkbox <default>");
      checkbox.set({
        width: 300,
        allowGrowX: false
      });
      container.add(checkbox);
      
      var checkboxChecked = new unify.ui.form.CheckBox("Checkbox <checked>", true);
      checkboxChecked.set({
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
              var btnID = e.getData();
              if (btnID == 'YES')
                this.debug("Good choice...")
              else
                this.debug("You ignorant fool! Watch this: http://www.youtube.com/watch?v=hQVTIJBZook")
            }
          );
        }, this);
      container.add(confirmButton);
      
      var textField = new unify.ui.form.TextField();
      textField.addListener("changeValue", function(e) {
        this.debug("Test field changed value to '" + e.getData() + "'");
      }, this);
      container.add(textField);
      
      var textArea = new unify.ui.form.TextArea();
      textArea.addListener("changeValue", function(e) {
        this.debug("Test area changed value to '" + e.getData() + "'");
      }, this);
      container.add(textArea);

      var slider = new unify.ui.form.Slider();
      slider.set({
        height: 300,
        allowGrowX: false,
        allowGrowY: false,
        allowShrinkX: false,
        allowShrinkY: false,
        direction: "vertical"
      });
      container.add(slider);
    },
    
    __dialog : null,
    
    __openDialog : function() {
      var dialog = this.__dialog = new unify.ui.dialog.GenericDialog("Das ist der Titel", []);
      dialog.addListener("execute", this.__onDialogExecute, this);
    }
  }
});

unify.core.Singleton.annotate(kitchensink.view.Ui);
