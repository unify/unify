
core.Module("unify.test.ui.layout.queue.Manager", {
  runTest : function() {
    
    module("unify.ui.layout.queue.Manager");
    
    var Manager = unify.ui.layout.queue.Manager;
    
    test("test for module", function() {
      ok(!!Manager, "Queue manager implemented");
    });
    
    test("test of register function", function() {
      ok(!!Manager.register, "Has registration function");
      
      raises(function() {
        Manager.register();
      }, function(e) {
        return e.message.indexOf("Parameter") !== -1;
      }, "Register without parameter");
      
      raises(function() {
        Manager.register("name");
      }, function(e) {
        return e.message.indexOf("Parameter") !== -1;
      }, "Register with name only");
      
      raises(function() {
        Manager.register(null, function(){});
      }, function(e) {
        return e.message.indexOf("Parameter") !== -1;
      }, "Register with callback only");
    });
    
    test("test run of queue", function() {
      raises(function() {
        Manager.run();
      }, function(e) {
        return e.message.indexOf("Parameter") !== -1;
      }, "Run without parameter");
    });
    
    asyncTest("test of real register and run", function() {
      Manager.clear();
      var called = false;
      
      Manager.register("trr", function() {
        called = true;
      });
      
      Manager.run("trr");
      if (called) {
        ok(false, "called imediately");
        start();
      } else {
        var okFnt = function() {
          ok(called, "called delayed");
          start();
        };
        
        window.setTimeout(okFnt, 0);
      }
    });
    stop();
    
    asyncTest("test order of registered callbacks, ordered run", function() {
      Manager.clear();
      var callstack = [];
      
      Manager.register("t1", function() {
        callstack.push("t1");
      });
      Manager.register("t2", function() {
        callstack.push("t2");
      }, this, "t1");
      
      Manager.run("t1");
      Manager.run("t2");
      
      window.setTimeout(function() {
        ok(callstack.length == 2 && callstack[0] == "t1" && callstack[1] == "t2", "Order of handlers with simple dependsOn paramter is right");
        start();
      }, 10);
    });
    stop();
    
    asyncTest("test order of registered callbacks, unordered run", function() {
      Manager.clear();
      var callstack = [];
      
      Manager.register("t3", function() {
        callstack.push("t3");
      });
      Manager.register("t4", function() {
        callstack.push("t4");
      }, this, "t3");
      
      Manager.run("t4");
      Manager.run("t3");
      
      window.setTimeout(function() {
        ok(callstack.length == 2 && callstack[0] == "t3" && callstack[1] == "t4", "Order of handlers with simple dependsOn paramter is right");
        start();
      }, 10);
    });
    stop();
    
    asyncTest("test complex order of registered callbacks, unordered run", function() {
      Manager.clear();
      var callstack = [];
      
      Manager.register("t7", function() {
        callstack.push("t7");
      }, this, "t5");
      Manager.register("t8", function() {
        callstack.push("t8");
      }, this, ["t5", "t6"]);
      Manager.register("t5", function() {
        callstack.push("t5");
      });
      Manager.register("t6", function() {
        callstack.push("t6");
      }, this, "t5");
      
      Manager.run("t5");
      Manager.run("t7");
      Manager.run("t8");
      Manager.run("t6");
      
      window.setTimeout(function() {
        var c = callstack;
        ok(c.length == 4 && c[0] == "t5" && 
           (c.indexOf("t7") > c.indexOf("t5")) &&
           (c.indexOf("t8") > c.indexOf("t5")) &&
           (c.indexOf("t8") > c.indexOf("t6")) &&
           (c.indexOf("t6") > c.indexOf("t5")),
           "Order of handlers with simple dependsOn paramter is right");
        start();
      }, 10);
    });
    stop();
    
    asyncTest("test flush only once if called many times", function() {
      Manager.clear();
      var called = 0;
      
      Manager.register("t9", function() {
        called++;
      });
      
      Manager.run("t9");
      Manager.run("t9");
      Manager.run("t9");
      
      window.setTimeout(function() {
        ok(called == 1, "Real flush only called once");
        start();
      }, 10);
    });
    stop();
    
    asyncTest("test flush twice if called asynchronously after js event queue", function() {
      Manager.clear();
      var called = 0;
      
      Manager.register("t10", function() {
        called++;
      });
      
      Manager.run("t10");
      
      window.setTimeout(function() {
        Manager.run("t10");
      }, 60);
      
      window.setTimeout(function() {
        ok(called == 2, "Flush called twice -> asynchronously with enough time");
        start();
      }, 100);
    });
    stop();
    
  }
});