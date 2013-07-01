
if (jasy.Env.isSet("runtime", "browser"))
{
  var suite = new core.testrunner.Suite("bom/Uri");

  suite.test("Basics", function() 
  {
    this.isIdentical(typeof unify.bom.Uri, "object");
  });
}