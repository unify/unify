/* ************************************************************************

   header

   Copyright:
     2010 Deutsche Telekom AG, Germany, http://telekom.com

 ************************************************************************ */

/* ************************************************************************

#asset(${NAMESPACE}/*)

************************************************************************ */

/**
 * Unify application class
 */
core.Class("${NAMESPACE}.Application", {
  include : [unify.Application],
  
  
  construct : function() {
    unify.Application.call(this);
  },
  
  /*
  *****************************************************************************
    MEMBERS
  *****************************************************************************
  */
  members: {
    
    //Overidden
    _getTheme : function() {
      return new unify.theme.Dark();
    },
    
    /*
    ---------------------------------------------------------------------------
      PRIVATE
    ---------------------------------------------------------------------------
    */
    
    
    /*
    ---------------------------------------------------------------------------
      PUBLIC
    ---------------------------------------------------------------------------
    */
    
    /**
     * This is the main function of the application. It will get
     * automatically get called after everything is loaded.
     */
    main: function() {
      // Call super class
      unify.Application.prototype.main.call(this);
      
      // Create view managers
      var masterViewManager = new unify.view.ViewManager("master");
      masterViewManager.register(${NAMESPACE}.view.Start, true);
      this.add(masterViewManager);
      
      // Add at least one view manager to the navigation managment
      var navigation = unify.view.Navigation.getInstance();
      navigation.register(masterViewManager);
      navigation.setStartView(${NAMESPACE}.view.Start);
      navigation.init();
    }
  }
});
