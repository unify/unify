qx.Class.define("unify.ui.widget.container.ToolBar", {
  extend: unify.ui.widget.container.Composite,
  
  construct : function(layout) {
    this.base(arguments, layout || new qx.ui.layout.HBox());
  },
  
  members : {
    setItems : function(items) {
      var elem = this.getElement();
      var itemElem;
      
      for (var i=0, l=items.length; i<l; i++)
      {
        itemElem = this._createItemElement(items[i]);
        elem._add(itemElem);
      }
    },


    /*
    ---------------------------------------------------------------------------
      PRIVATE METHODS
    ---------------------------------------------------------------------------
    */
    
/*    __onChangeSegment : function(e)
    {
      var 
        Class = qx.bom.element2.Class,
        allSegmented = e.getTarget().getElement().querySelectorAll(".segmented");
        
      for (var i = 0, l =  allSegmented.length; i < l; i += 1) 
      {
        if (allSegmented[i])
        {
          var old = allSegmented[i].querySelector(".selected");
          if (old) 
          {
            Class.remove(old, "selected");
          }

          var next = allSegmented[i].querySelector("[goto='." + e.getData() + "']");
          if (next) 
          {
            Class.add(next, "selected");
          }
        }
      }
      
    },
    
    
    __createSegmentButtonElement : function(config, selected)
    {
      var buttonElem = document.createElement("div");
      buttonElem.setAttribute("goto", "." + config.segment);
      buttonElem.className = config.segment == selected ? "button selected" : "button";
      
      if (config.label) {
        buttonElem.innerHTML = config.label;
      } else if (config.icon) {
        buttonElem.innerHTML = "<div/>";
      }
      
      return buttonElem;
    },*/

    _createItemElement : function(config)
    {
      var itemElem = new unify.ui.widget.form.Button();
      /*
      // create base element
      itemElem = document.createElement(config.kind == "header" ? "h1" : "div");
      
      // special segment handling
      if (config.kind == "segmented")
      {
        var view = config.view;
        var segment = view.getSegment();
        
        var buttons = config.buttons;
        for (var i=0, l=buttons.length; i<l; i++) {
          itemElem.appendChild(this.__createSegmentButtonElement(buttons[i], segment));
        }
        view.addListener("changeSegment", this.__onChangeSegment, this);
      }*/

      var navigation = {};
      
      // rel is independently usable
      if (config.rel) {
        navigation.relation = config.rel;
      }
      
      // there can be only one of [jump, exec, show]
      if (config.jump) {
        navigation.goTo = config.jump;
      } else if (config.exec) {
        navigation.execute = config.exec;
      } else if (config.show) {
        navigation.show = config.show;
      }
/*      
      // spacer sizing
      if (config.size) {
        itemElem.setAttribute("style", 'max-width: ' + config.size + '; min-width: ' + config.size + ';');
      }
      
      // add kind as CSS class
      if (config.kind) {
        qx.bom.element2.Class.add(itemElem, config.kind);
      }
      
      // add additional classes
      if (config.addclass) {
        qx.bom.element2.Class.add(itemElem, config.addclass);
      }
      
      if (config.style) {
        qx.bom.element2.Class.add(itemElem, config.style);
      }
      
      // add label or icon container
      if (config.label) {
        itemElem.innerHTML = config.label;
      } else if (config.icon) {
        itemElem.innerHTML = "<div/>";
      }*/

      if (config.label) {
        itemElem.setValue(config.label);
      }

      itemElem.set(navigation);
      
      return itemElem;
    }
  },
  
  destruct : function() {
    this.__view = null;
    this.__toolBar.dispose();
    this.__toolBar = null;
  }
});
