/* ************************************************************************

  coretest

  Copyright:
    2009 Deutsche Telekom AG, Germany, http://telekom.com

 ************************************************************************ */

/**
 * Start View
 */
core.Class("coretest.view.Test", {
  include : [unify.view.StaticView],

  construct : function() {
    unify.view.StaticView.call(this);
  },

  members : 
  {
    // overridden
    getTitle : function(type, param) {
      return "My Own";
    },

    /**
     * #asset(coretest/clock.png)
     */
    // overridden
    getIcon : function(type, param) {
      return "coretest/clock.png";
    },
    
    // overridden
    _createView : function() 
    {
      var navbar = new unify.ui.container.NavigationBar(this);
      this.add(navbar, {flex: 1});
      
      var content = new unify.ui.basic.Label("Another test view");
      content.setWidth(200);
      this.add(content);
    }
  }
});

unify.core.Singleton.annotate(coretest.view.Test);
