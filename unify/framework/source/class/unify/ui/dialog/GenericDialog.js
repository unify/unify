/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2012 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */

/**
 * Generic modular dialog
 */
qx.Class.define("unify.ui.dialog.GenericDialog", {
  extend : unify.ui.container.Composite,
  include: [
            qx.locale.MTranslation,
            unify.ui.core.MChildControl,
            unify.ui.core.MRemoteChildrenHandling
           ],
  
  
  /*
   *****************************************************************************
     STATICS
   *****************************************************************************
   */
  statics: {
    
    /**
     * The ID of the CLOSE button. (The one in the right upper corner)
     */
    BTN_CLOSE: "CLOSE",
    
    /**
     * The ID of the default OK button
     */
    BTN_OK: "OK"
  },
  
  /*
   *****************************************************************************
     EVENTS
   *****************************************************************************
   */
   
  events: {
    /** This event is fired when the dialog is closed by pressing a button */
    "execute": "qx.event.type.Data"
  },
  
  /**
   * Creates a new generic dialog
   *
   * @param title {String} Title of dialog
   * @param buttons {Array} Array of buttons
   */
  construct: function(title, buttons) {
    this.base(arguments, new qx.ui.layout.VBox());
    
    this.__createUI(title, buttons);
  },
  
  /*
   *****************************************************************************
     PROPERTIES
   *****************************************************************************
   */
  properties : {
    // overridden
    appearance : {
      refine: true,
      init: "dialog"
    }
  },
  
  /*
   *****************************************************************************
     MEMBERS
   *****************************************************************************
   */
  members : {
    
    /**
     * Get children container that is accessed via remote child handling
     *
     * @return {unify.ui.core.Widget} Container
     */
    getChildrenContainer : function() {
      return this.getChildControl("content");
    },
    
    /**
     * Creates child controls
     *
     * @param id {String} ID of control
     * @return {unify.ui.core.Widget} Widget
     */
    _createChildControlImpl : function(id) {
      var control;
      
      if (id == "X") {
        // close button (right upper corner)
        control = new unify.ui.form.Button(this.tr("Close"));
        this._add(control);
      } else if (id == "title") {
        control = new unify.ui.basic.Label();
        control.set({
          alignX: "center",
          alignY: "bottom"
        });
        this._add(control);
      } else if (id == "content") {
        control = new unify.ui.container.Composite(new qx.ui.layout.VBox());
        control.set({
          allowGrowX: true,
          allowGrowY: true,
          allowShrinkX: true,
          allowShrinkY: true
        });
        this._add(control, { flex: 1 });
      } else if (id == "buttons") {
        control = new unify.ui.container.Composite(new qx.ui.layout.HBox(10));
        control.set({
          allowGrowX: true,
          allowGrowY: false,
          allowShrinkX: true,
          allowShrinkY: false
        });
        this._add(control);
      }
      
      return control; // || this.base(arguments, id);
    },
    
    /**
     * Creates UI
     *
     * @param title {String} Title of UI
     * @param buttons {Array} Array of buttons to show
     */
    __createUI : function(title, buttons) {
      var X = this._showChildControl("X");
      X.addListener("execute", this.__onButtonExecute, this);
      X.setUserData("id", this.self(arguments).BTN_CLOSE);
      
      this._showChildControl("title").setValue(title);
      this._showChildControl("content");
      var buttonContainer = this._showChildControl("buttons");
      
      this.__createButtons(buttonContainer, buttons);
    },
    
    /**
     * Creates buttons in UI
     *
     * @param buttonContainer {unify.ui.core.Widget} Container to add buttons to
     * @param buttons {Array} Array of button configurations to add to buttonContainer
     */
    __createButtons : function(buttonContainer, buttons) {
      var leftButtonContainer_layout = new qx.ui.layout.HBox();
      leftButtonContainer_layout.setAlignX("left");
      leftButtonContainer_layout.setSpacing(10);
      var leftButtonContainer = new unify.ui.container.Composite(leftButtonContainer_layout);
      
      var centerButtonContainer_layout = new qx.ui.layout.HBox();
      centerButtonContainer_layout.setAlignX("center");
      centerButtonContainer_layout.setSpacing(10);
      var centerButtonContainer = new unify.ui.container.Composite(centerButtonContainer_layout);
      
      var rightButtonContainer_layout = new qx.ui.layout.HBox();
      rightButtonContainer_layout.setAlignX("right");
      rightButtonContainer_layout.setSpacing(10);
      var rightButtonContainer = new unify.ui.container.Composite(rightButtonContainer_layout);
      
      buttonContainer.add(leftButtonContainer, {flex: 2});
      buttonContainer.add(centerButtonContainer, {flex: 1});
      buttonContainer.add(rightButtonContainer, {flex: 2});
      
      if (!buttons || (buttons.length <= 0)) {
        // No buttons are specified. Create a default Button
        
        var okBtn = this.__okBtn = new unify.ui.form.Button(this.tr("OK"));
        okBtn.setAppearance("dialog.button");
        okBtn.set({
          allowGrowX: true,
          allowGrowY: false,
          alignY: "middle"
        });
        
        qx.bom.Element.addListener(okBtn.getElement(), "click", function() {
          this.fireDataEvent('execute', this.self(arguments).BTN_OK);
        }, this, false);
        
        centerButtonContainer.add(okBtn);
      
      } else  {
        // generate buttons
        
        var btnCount = buttons.length;
        
        if (btnCount > 4) {
          this.warn("Too much buttons. Maximal 4 buttons are supported.");
          btnCount = 4;
        }
        
        for (var i=0; i<btnCount; i++) {
          var button = buttons[i];
          
          //error handling
          if (!button.label) {
            this.warn("Button #"+i+" has no label.");
            continue;
          }
          if (!button.id) {
            this.warn("Button #"+i+" has no id.");
            continue;
          }
          if (!button.align) {
            this.warn("Button #"+i+" has no align. Using default align");
            button.align = "right";
          }
          
          // create new button
          var userBtn = new unify.ui.form.Button(button.label);
          userBtn.setUserData("id", button.id);
          userBtn.setAppearance("dialog.button");
          userBtn.set({
            allowGrowX: true,
            allowGrowY: false,
            alignY: "middle"
          });
          
          userBtn.addListener("execute", this.__onButtonExecute, this);
          
          // add the new button to the right alignment container
          switch (button.align.toUpperCase()) {
            case "LEFT": 
              leftButtonContainer.add(userBtn);
              break;
            case "CENTER":
              centerButtonContainer.add(userBtn);
              break;
            default:
              this.warn("Button #"+i+": align \""+button.align+"\" is invalid. Using default align");
            case "RIGHT":
              rightButtonContainer.add(userBtn);
          }
          
        }
      }
      
      return buttonContainer;
    },
    
    /**
     * Handler for tap on buttons
     * @param e {qx.event.type.Event} Event
     */
    __onButtonExecute : function(e) {
      this.fireDataEvent("execute", e.getTarget().getUserData("id"));
    }
  
  }
});
