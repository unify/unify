/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2010, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * EXPERIMENTAL
 */
qx.Class.define("unify.ui.widget.container.ToolBar", {
  extend: unify.ui.widget.container.Bar,
  
  construct : function(layout) {
    this.base(arguments);
    this._setLayout(layout || new qx.ui.layout.HBox());
  },
  
  properties : {
    // overridden
    appearance :
    {
      refine: true,
      init: "toolbar"
    }
  },
  
  members : {
    /*
    ---------------------------------------------------------------------------
      PRIVATE METHODS
    ---------------------------------------------------------------------------
    */
    
    _createItemElement : function(config)
    {
      var itemElem;
      
      if (config.kind == "button") {
        itemElem = new unify.ui.widget.form.Button();
  
        var navigation = {};
        
        // rel is independently usable
        if (config.rel) {
          itemElem.setRelation(config.rel);
        }
        
        // there can be only one of [jump, exec, show]
        if (config.jump) {
          itemElem.setGoTo(config.jump);
        } else if (config.exec) {
          itemElem.setExecute(config.exec);
        } else if (config.show) {
          itemElem.setShow(config.show);
        }
  
        if (config.label) {
          itemElem.setValue(config.label);
        }
  
      } else if (config.kind == "segmented") {
        itemElem = new unify.ui.widget.container.Composite(new qx.ui.layout.HBox());
        
        var buttons = config.buttons;
        for (var i=0,ii=buttons.length; i<ii; i++) {
          var button = buttons[i];
          
          var el = new unify.ui.widget.form.Button(button.label);
          el.setGoTo("."+button.segment);
          itemElem.add(el);
        }
      } else if (config.kind = "spacer") {
        itemElem = new unify.ui.widget.container.Spacer();
      }
      
      return itemElem;
    }
  }
});
