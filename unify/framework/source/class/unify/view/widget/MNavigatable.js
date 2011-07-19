qx.Mixin.define("unify.view.widget.MNavigatable", {
  members : {
    __makeNavigatable : function(widget) {
      var e = widget.getElement();
      // Register to navigation events
      qx.event.Registration.addListener(e, "click", this.__onClick, this);//TODO remove click handling, we care for touches. clicks are emulated into touches if neccassary
      qx.event.Registration.addListener(e, "tap", this._onTap, this);
      qx.event.Registration.addListener(e, "touchhold", this._onTouchHold, this);
      qx.event.Registration.addListener(e, "touchrelease", this._onTouchRelease, this);
      qx.event.Registration.addListener(e, "touchleave", this._onTouchRelease, this);//TODO separate onTouchLeave handler that prevents tap after leave?
    },
    
    __onClick : function(e) {
      var elem = unify.bom.Hierarchy.closest(e.getTarget(), "a[href]");
      if (elem) {
        e.preventDefault();
      }
    },
    
    __getTapFollowElement : function(e) {
      //var followable = "a[href],[rel],[goto],[exec],[show],[hide]";
      var followable = ".navigateble";
    
      var elem = unify.bom.Hierarchy.closest(e.getTarget(), followable);
      var widget = elem && qx.core.ObjectRegistry.fromHashCode(elem.$$widget);
      
      return widget;
    },
    
    __tapHelper : function(e) {
      var widget = this.__getTapFollowElement(e);

      if (widget && widget.getEnabled()) {
        // Stop further event processing
        e.stopPropagation();

        // Support executing public function on currently selected view
        var exec = widget.getExecute && widget.getExecute(); //elem.getAttribute("exec");
        if (exec)
        {
          this.getCurrentView()[exec](widget);
        }
        else
        {
          // Detect absolute links
          var href = widget.getHyperreference && widget.getHyperreference(); //elem.getAttribute("href");
          if (href != null && href != "" && href.charAt(0) != "#") {
            window.open(href);
          }

          // Lazily navigate (omits navigation during activity)
          else if (!this.__navigates)
          {
            this.__navigates = true;
            qx.lang.Function.delay(this.__navigationWidgetHelper, 0, this, widget);
          }
        }
      }
    },
    
    __navigationWidgetHelper : function(widget) {
      // Reset event blocking flag
      this.__navigates = false;

      // Check up-navigation request first
      //var rel = elem.getAttribute("rel");
      var rel = widget.getRelation && widget.getRelation();
      if (rel == "parent" || rel == "close")
      {
        if(this.__path.length == 1) {
          if(this.getDisplayMode()=='default'){
            this.hide();
          } else {
            unify.view.PopOverManager.getInstance().hide(this.getId());
          }
        } else {
          this.navigate(this.__path.slice(0, -1));
        }
        return;
      }
      
      // Support for showing/hiding another view manager (without a specific view e.g. a pop over)
      // TODO: Are there other kinds of view managers which might be shown here (not just popups)?
      //var show = elem.getAttribute("show");
      var show = widget.getShow && widget.getShow();
      if (show != null)
      {
        unify.view.PopOverManager.getInstance().show(show);
        return;
      }

      //var hide = elem.getAttribute("hide");
      var hide = widget.getHide && widget.getHide();
      if (hide != null)
      {
        unify.view.PopOverManager.getInstance().hide(hide);
        return;
      }

      // Read attributes
      //var href = elem.getAttribute("href");
      var href = widget.getHyperreference && widget.getHyperreference();
      //var dest = href ? href.substring(1) : elem.getAttribute("goto");
      var dest = href ? href.substring(1) : widget.getGoTo && widget.getGoTo();
      if (dest == null) {
        throw new Error("Empty destination found!");
      }

      // Valid Paths (leading with a "#" in href attributes):
      // localView.segment:param (in transition)
      // otherView.segment:param (globally known view => delegate to navigation)
      // .segment:param (switch segment and param, no transition)
      // .segment (switch segment, no transition)
      // :param (switch param, no transition)

      if (qx.core.Environment.get("qx.debug"))
      {
        if (rel) {
          throw new Error("Invalid 'rel' attribute: " + rel);
        }
      }
      
      var config = unify.view.Path.parseFragment(dest);
      var view = config.view;
      if (view && !this.getView(view))
      {
        unify.view.Navigation.getInstance().navigate(new unify.view.Path(config));
      }
      else
      {
        // Read current path and make non-deep copy of path
        var path = this.getPath();
        var clone = path.concat();
        var cloneLast = clone.length-1;
        
        // Select right modification point
        if (rel == "same") 
        {
          clone[cloneLast] = config;
        } 
        else if (config.view) 
        {
          clone.push(config);
        } 
        else 
        {
          if (config.segment) {
            clone[cloneLast].segment = config.segment;
          }

          if (config.param) {
            clone[cloneLast].param = config.param;
          }
        }

        // Finally do the navigate()
        console.log("NAVIGATE TO ", clone);
        this.navigate(clone);
      }
    }
  }
});