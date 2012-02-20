
core.Module("unify.test.ui.core.VisibleBox", {
  test : function() {
    
    module("unify.ui.core.VisibleBox");
    
    test("test for class", function() {
      ok(!!(new unify.ui.core.VisibleBox()), "VisibleBox implemented");
    });
        
  }
});
