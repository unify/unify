/* ************************************************************************

   ${Name}

   Copyright:
     2010 Deutsche Telekom AG, Germany, http://telekom.com

 ************************************************************************ */

/* ************************************************************************

#asset(${NamespacePath}/desktop/*)
#require(qx.log.appender.Native)

 ************************************************************************ */

/**
 * Unify application class for the desktop browser.
 */
qx.Class.define("${Namespace}.application.Desktop", 
{
  extend : qx.application.Standalone,

  members : 
  {
    // overridden
    main : function() 
    {
      // Call super class
      this.base(arguments);

      // Create a button
      var button1 = new qx.ui.form.Button("First Button");

      // Document is the application root
      var doc = this.getRoot();

      // Add button to document at fixed coordinates
      doc.add(button1, {
        left : 100,
        top : 50
      });

      // Add an event listener
      button1.addListener("execute", function(e) {
        alert("Hello World!");
      });
    }
  }
});
