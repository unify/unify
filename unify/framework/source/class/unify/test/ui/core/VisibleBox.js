
core.Module("unify.test.ui.core.VisibleBox", {
  test : function() {
    
    module("unify.ui.core.VisibleBox");
    
    test("test for class", function() {
      ok(!!(new unify.ui.core.VisibleBox()), "VisibleBox implemented");
    });
    
    test("parent box", function() {
      var t1 = new unify.ui.core.VisibleBox();
      var t2 = new unify.ui.core.VisibleBox();
      
      t1.setParentBox(t2);
      equal(t2, t1.getParentBox(), "Parent box settings");
    });
    
    test("layout properties", function() {
      var v = new unify.ui.core.VisibleBox();
      
      v.setLayoutProperties({a: true, b: false});
      
      var res = v.getLayoutProperties();
      
      equal(true, res.a, "Layout property a set");
      equal(false, res.b, "Layout property b set");
    });
    
    test("update layout properties", function() {
      var v = new unify.ui.core.VisibleBox();
      
      var called = false;
      unify.ui.layout.queue.Layout.add = function() {
        called = true;
      };
      
      v.updateLayoutProperties();
      equal(true, called, "Layout update schedules");
    });
  }
});
