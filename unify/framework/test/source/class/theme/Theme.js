
if (jasy.Env.isSet("runtime", "browser"))
{
  var suite = new core.testrunner.Suite("theme/Theme");


  suite.test("test for class", function() 
  {
    this.isTrue(!!(new unify.theme.Theme({}) ), "Class is available" );
  });

  suite.test("theme name", function() {
    var t = new unify.theme.Theme({
      name: "Testname"
    });
    this.isEqual(t.name(), "Testname", "Theme has name Testname");
  });

  suite.test("colors", function() {
    var t = new unify.theme.Theme({
      colors: {
        color1: "#ff0000",
        color2: "green"
      }
    });
    this.isEqual(t.resolveColor("color1"), "#ff0000", "Color1 is red");
    this.isEqual(t.resolveColor("color2"), "green", "Color2 is green");
    this.isEqual(t.resolveColor("color3"), null, "Color3 is not set");
  });

  suite.test("fonts", function() {
    jasy.Asset.addData({
      profiles : [],
      assets : {
        "testfont.woff" : {
          p:0,
          u:"testfont"
        },
        "testfont.ttf" : {
          p:0,
          u:"testfont"
        },
        "testfont.svg" : {
          p:0,
          u:"testfont"
        },
        "testfont.eot" : {
          p:0,
          u:"testfont"
        }
      }
    });

    var t = new unify.theme.Theme({
      fonts: {
        font0: {},
        font1: {
          family: "sans-serif",
          size: 12,
          style: "italic",
          weight: "bold",
          decoration: "underline",
          lineHeight: 1.5
        },
        font2: {
          family: "Droid",
          webfont: new unify.theme.WebFont("testfont")
        }
      }
    });
    var font0 = t.resolveFont("font0");
    this.isEqual(font0.fontSize, "16px", "Size of font0 is 16px per default");
    this.isEqual(font0.fontStyle, "normal", "Style of font0 is normal per default");
    this.isEqual(font0.fontWeight, "normal", "Weight of font0 is normal per default");
    this.isEqual(font0.textDecoration, "none", "Text decoration of font0 is none per default");
    this.isEqual(font0.lineHeight, 1.0, "Line height of font0 is 1.0 per default");
    this.isEqual(font0.fontObject, null, "Font object of font0");
    
    var font1 = t.resolveFont("font1");
    this.isEqual(font1.fontFamily, "sans-serif", "Font family of font1");
    this.isEqual(font1.fontSize, "12px", "Size of font1");
    this.isEqual(font1.fontStyle, "italic", "Style of font1");
    this.isEqual(font1.fontWeight, "bold", "Weight of font1");
    this.isEqual(font1.textDecoration, "underline", "Text decoration of font1");
    this.isEqual(font1.lineHeight, 1.5, "Line height of font1");
    
    var font2 = t.resolveFont("font2");
    this.isEqual(font2.fontFamily, "Droid", "Font family of font2");
    this.isEqual(font0.fontSize, "16px", "Size of font2");
    this.isEqual(font0.fontStyle, "normal", "Style of font2");
    this.isEqual(font0.fontWeight, "normal", "Weight of font2");
    this.isEqual(font0.textDecoration, "none", "Text decoration of font2");
    this.isEqual(font0.lineHeight, 1.0, "Line height of font2");
    
    this.isNull(t.resolveFont("font3"),"font3 is not set");
  });

  suite.test("styles", function() {
    var t = new unify.theme.Theme({
      styles: {
        "a" : {
          style : function(state) {
            return {
              a : true
            };
          }
        },
        "b" : {
          include : "a"
        },
        "c" : {
          include : "b",
          style : function(state) {
            return {
              c : true
            };
          }
        },
        "d" : {
          style : function(state) {
            return {
              d : true
            };
          }
        },
        "e": "a"
      }
    });
    
    this.isEqual(t.resolveStyle("a").a, true, "Appearance a style a");
    this.isEqual(t.resolveStyle("b").a, true, "Appearance b style a");
    this.isEqual(t.resolveStyle("c").a, true, "Appearance c style a");
    this.isEqual(t.resolveStyle("c").c, true, "Appearance c style c");
    this.isEqual(t.resolveStyle("d").d, true, "Appearance d style d");
    this.isEqual(t.resolveStyle("e").a, true, "Appearance e style a");
    this.isEqual(t.resolveStyle("z"), null, "Appearance z is null");
  });

  suite.test("inherited styles", function() {
      var t1 = new unify.theme.Theme({
        styles: {
          "a" : {
            style : function(state) {
              return {
                  a1 : true,
                  a3 : "1"
              };
            }
          }
        }
      });
      var t2 = new unify.theme.Theme({
        include: t1,
        styles: {
          "a" : {
          style : function(state) {
            return {
              a2 : true,
              a3 : "2"
            };
            }
          }
        }
      });
      
      this.isEqual(t2.resolveStyle("a").a1, true, "Appearance a style a1");
      this.isEqual(t2.resolveStyle("a").a2, true, "Appearance a style a2");
      this.isEqual(t2.resolveStyle("a").a3, "2", "Appearance a style a3");
  });
}
