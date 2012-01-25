/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2011 Deutsche Telekom AG, Germany, http://telekom.com
    
*********************************************************************************************** */

/**
 * EXPERIMENTAL
 * @deprecated
 */
qx.Class.define("unify.ui.dialog.Alert", {
  extend: unify.ui.container.Composite,
  
  /**
   * @param value {String} Dialog text
   * @param onOk {Function} onOkay callback
   */
  construct : function(value, onOk) {
    this.base(arguments);
    var vboxLayout = new qx.ui.layout.VBox();
    vboxLayout.setAlignX( "center" ); 
    this._setLayout(vboxLayout);
    this.__setDialogText(value);
    var labelWidget = this.__labelWidget = new unify.ui.basic.Label(value);
    labelWidget.set({appearance: 'alert.label', height: 75, width: 280});
    this._add(labelWidget); 
    this._addButton('OK', onOk);
  },
  
  properties : {

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
    
    /**
     * {unify.ui.container.Composite} container for buttons in dialog.
     * Buttons schould be centered.
     */
    __buttonBar : null,

    /**
     * {unify.ui.basic.Label} label that contains the text for the dialog
     */
    __labelWidget: null,
    
    /**
     * add a button to a {qx.ui.layout.HBox} hbox layout button container. 
     * 
     * @param label {String} ok or cancel button text.
     * @param callback {Function} response function to clicked button.
     */
    _addButton : function(label, callback){
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