
if (jasy.Env.isSet("runtime", "browser"))
{
  var suite = new core.testrunner.Suite("core/VisibleBox");

  suite.test("test for class", function() {
    this.isTrue(!!(new unify.ui.core.VisibleBox()), "VisibleBox implemented");
  });

  
  suite.test("parent box", function() {
    var t1 = new unify.ui.core.VisibleBox();
    var t2 = new unify.ui.core.VisibleBox();
    
    t1.setParentBox(t2);
    this.isEqual(t2, t1.getParentBox(), "Parent box settings");
  });
  
  suite.test("layout properties", function() {
    var v = new unify.ui.core.VisibleBox();
    
    v.setLayoutProperties({a: true, b: false});
    
    var res = v.getLayoutProperties();
    
    this.isEqual(true, res.a, "Layout property a set");
    this.isEqual(false, res.b, "Layout property b set");
  });
  
  suite.test("update layout properties", function() {
    var v = new unify.ui.core.VisibleBox();
    
    var called = false;
    unify.ui.layout.queue.Layout.add = function() {
      called = true;
    };
    
    v.updateLayoutProperties();
    this.isEqual(true, called, "Layout update schedules");
  });
  
  suite.test("render layout", function() {
    
    var v = new unify.ui.core.VisibleBox();
    
    var c = v.renderLayout(5, 10, 20, 30);
    
    this.isEqual(c.position, true, "Position changed");
    this.isEqual(c.size, true, "Size changed");
    
    var b = v.getBounds();

    this.isEqual(b.left, 5, "Left position");
    this.isEqual(b.top, 10, "Top position");
    this.isEqual(b.width, 20, "Width");
    this.isEqual(b.height, 30, "Height");
    
  });
  
  suite.test("nesting level", function() {
    
    var v1 = new unify.ui.core.VisibleBox();
    var v2 = new unify.ui.core.VisibleBox();
    var v3 = new unify.ui.core.VisibleBox();
    
    v2.setParentBox(v1);
    v3.setParentBox(v2);
    v1.getNestingLevel = function() { return 0; };
    
    this.isEqual(v1.getNestingLevel(), 0, "Nesting level of root widget");
    this.isEqual(v2.getNestingLevel(), 1, "Nesting level of second widget");
    this.isEqual(v3.getNestingLevel(), 2, "Nesting level of third widget");
  });
  
  suite.test("size hint", function() {
    
    var v = new unify.ui.core.VisibleBox();
    
    this.isEqual(v.getSizeHint(false), null, "Non computed size hint");
    
    var d = v.getSizeHint();
    this.isEqual(d.width, 0);
    this.isEqual(d.height, 0);
    this.isEqual(d.minWidth, 0);
    this.isEqual(d.minHeight, 0);
    this.isEqual(d.maxWidth, Infinity);
    this.isEqual(d.maxHeight, Infinity);
    
    v.setWidth(10);
    v.setHeight(20);
    
    d = v.getSizeHint();
    //equal(d.width, 0);
    //equal(d.height, 0);
    this.isEqual(d.width, 10);
    this.isEqual(d.height, 20);
    this.isEqual(d.minWidth, 0);
    this.isEqual(d.minHeight, 0);
    this.isEqual(d.maxWidth, Infinity);
    this.isEqual(d.maxHeight, Infinity);
    
    v.invalidateLayoutCache();
    
    d = v.getSizeHint();
    this.isEqual(d.width, 10);
    this.isEqual(d.height, 20);
    this.isEqual(d.minWidth, 0);
    this.isEqual(d.minHeight, 0);
    this.isEqual(d.maxWidth, Infinity);
    this.isEqual(d.maxHeight, Infinity);
  });


}
