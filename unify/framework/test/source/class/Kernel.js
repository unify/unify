core.Module("test.Kernel",
{
  init : function() {
    core.io.Script.load("script/test-" + jasy.Env.getId() + ".js");
  }
});
