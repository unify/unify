/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2011 Deutsche Telekom AG, Germany, http://telekom.com
    
*********************************************************************************************** */

/**
 * EXPERIMENTAL
 */
qx.Class.define("unify.ui.dialog.Alert", {
  extend: unify.ui.container.Composite,
  
  construct : function(value, onOk) {
    this.base(arguments);
    this.__setVBoxLayout();
    this.__setDialogText(value);
    this.__addButton('OK', onOk);
  },
  
  properties : {
    /** Contains the label content */
    value : {
      check: "String",
      nullable: false
    },
    
    // overridden
    allowGrowX : {
      refine : true,
      init : false
    },


    // overridden
    allowGrowY : {
      refine : true,
      init : false
    },
    
    // overridden
    appearance :
    {
      refine: true,
      init: "alert"
    }
  },
  
  members: {
    //container for buttons with hbox layout. 
    //buttons should be centered.
    __buttonBar : null,
    
    /**
     * Set vbox layout for the dialog.
     */
    __setVBoxLayout : function(){
      var vboxLayout = new qx.ui.layout.VBox();
      vboxLayout.setAlignX( "center" ); 
      this._setLayout(vboxLayout);
    },
    
    /**
     * Set text for the dialog.
     * 
     * @param value {String} dialog text.
     */
    __setDialogText : function(value){
      if(value){ 
    	this.setValue(value);
    	//create a label widget and add it to alert.
    	var labelWidget = new unify.ui.basic.Label(value);
    	labelWidget.set({appearance: 'alert.label', height: 75, width: 280});
    	this._add(labelWidget); 
      } else throw "Dialog must show some information";	
    },
    
    /**
     * add a button to a hbox layout button bar. 
     * 
     * @param label {String} ok or cancel button text.
     * @param callback {Function} response function to clicked button.
     */
    __addButton : function(label, callback){
      if(!this.__buttonBar){
      	this.__buttonBar = new unify.ui.container.Composite();
      	var hboxLayout = new qx.ui.layout.HBox();
        hboxLayout.setAlignX( "center" );
        hboxLayout.setSpacing(6);
      	this.__buttonBar._setLayout(hboxLayout);
      	this._add(this.__buttonBar); 
      }
      //Create a button and add it into the button bar.
      var buttonWidget = new unify.ui.form.Button(label).set({appearance: 'alert.button', width:100});  
      //Add button to this composite
      this.__buttonBar._add(buttonWidget);
      //Add listener to button click
      buttonWidget.addListener("execute", 
        function(){
      	  if(callback){
      	    callback();
      	  }
      	  this.hide();
      	},
        this);
    }
    
  }
});
