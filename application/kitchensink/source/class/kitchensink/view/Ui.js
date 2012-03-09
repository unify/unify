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
      
      
    }
  }
});

unify.core.Singleton.annotate(kitchensink.view.Ui);
