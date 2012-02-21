
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
    
    test("render layout", function() {
      
      var v = new unify.ui.core.VisibleBox();
      
      var c = v.renderLayout(5, 10, 20, 30);
      
      equal(c.position, true, "Position changed");
      equal(c.size, true, "Size changed");
      
      var b = v.getBounds();
      
      equal(b[0], 5, "Left position");
      equal(b[1], 10, "Top position");
      equal(b[2], 20, "Width");
      equal(b[3], 30, "Height");
      
    });
    
    test("nesting level", function() {
      
      var v1 = new unify.ui.core.VisibleBox();
      var v2 = new unify.ui.core.VisibleBox();
      var v3 = new unify.ui.core.VisibleBox();
      
      v2.setParentBox(v1);
      v3.setParentBox(v2);
      v1.isRootWidget = function() { return true; };
      
      equal(v1.getNestingLevel(), 0, "Nesting level of root widget");
      equal(v2.getNestingLevel(), 1, "Nesting level of second widget");
      equal(v3.getNestingLevel(), 2, "Nesting level of third widget");
    });
    
    test("size hint", function() {
      
      var v = new unify.ui.core.VisibleBox();
      
      equal(v.getSizeHint(false), null, "Non computed size hint");
      
      var d = v.getSizeHint();
      equal(d.width, 0);
      equal(d.height, 0);
      equal(d.minWidth, 0);
      equal(d.minHeight, 0);
      equal(d.maxWidth, Infinity);
      equal(d.maxHeight, Infinity);
      
      v.setWidth(10);
      v.setHeight(20);
      
      d = v.getSizeHint();
      equal(d.width, 0);
      equal(d.height, 0);
      equal(d.minWidth, 0);
      equal(d.minHeight, 0);
      equal(d.maxWidth, Infinity);
      equal(d.maxHeight, Infinity);
      
      v.invalidateLayoutCache();
      
      d = v.getSizeHint();
      equal(d.width, 10);
      equal(d.height, 20);
      equal(d.minWidth, 0);
      equal(d.minHeight, 0);
      equal(d.maxWidth, Infinity);
      equal(d.maxHeight, Infinity);
    });
  }
});
