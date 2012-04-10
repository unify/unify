
core.Module("unify.test.theme.Theme", {
  test : function() {
    
    module("unify.theme.Theme");
    
    test("test for class", function() {
      ok(!!(new unify.theme.Theme({})), "Theme implemented");
    });
    
    test("name", function() {
      var t = new unify.theme.Theme({
        name: "Testname"
      });
      
      equal(t.name(), "Testname", "Theme has name Testname");
    });
    
    test("colors", function() {
      var t = new unify.theme.Theme({
        colors: {
          color1: "#ff0000",
          color2: "green"
        }
      });
      
      equal(t.resolveColor("color1"), "#ff0000", "Color1 is red");
      equal(t.resolveColor("color2"), "green", "Color2 is green");
      equal(t.resolveColor("color3"), null, "Color3 is not set");
    });
    
    test("fonts", function() {
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
            src: "Droid.ttf"
          }
        }
      });
      
      var font0 = t.resolveFont("font0");
      equal(font0.fontFamily, "serif", "Font0 is serif per default");
      equal(font0.fontSize, "16px", "Size of font0 is 16px per default");
      equal(font0.fontStyle, "normal", "Style of font0 is normal per default");
      equal(font0.fontWeight, "normal", "Weight of font0 is normal per default");
      equal(font0.textDecoration, "none", "Text decoration of font0 is none per default");
      equal(font0.lineHeight, 1.0, "Line height of font0 is 1.0 per default");
      equal(font0.fontObject, null, "Font object of font0");
      
      var font1 = t.resolveFont("font1");
      equal(font1.fontFamily, "sans-serif", "Font family of font1");
      equal(font1.fontSize, "12px", "Size of font1");
      equal(font1.fontStyle, "italic", "Style of font1");
      equal(font1.fontWeight, "bold", "Weight of font1");
      equal(font1.textDecoration, "underline", "Text decoration of font1");
      equal(font1.lineHeight, 1.5, "Line height of font1");
      
      var font2 = t.resolveFont("font2");
      equal(font2.fontFamily, "Droid", "Font family of font2");
      equal(font0.fontSize, "16px", "Size of font2");
      equal(font0.fontStyle, "normal", "Style of font2");
      equal(font0.fontWeight, "normal", "Weight of font2");
      equal(font0.textDecoration, "none", "Text decoration of font2");
      equal(font0.lineHeight, 1.0, "Line height of font2");
      ok(font2.fontObject instanceof lowland.bom.Font, "Font object of font2");
      
      equal(t.resolveFont("font3"), null, "font3 is not set");
    });
    
    test("styles", function() {
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
      
      equal(t.resolveStyle("a").a, true, "Appearance a style a");
      equal(t.resolveStyle("b").a, true, "Appearance b style a");
      equal(t.resolveStyle("c").a, true, "Appearance c style a");
      equal(t.resolveStyle("c").c, true, "Appearance c style c");
      equal(t.resolveStyle("d").d, true, "Appearance d style d");
      equal(t.resolveStyle("e").a, true, "Appearance e style a");
      equal(t.resolveStyle("z"), null, "Appearance z is null");
    });
    
    test("child control styles", function() {
      var t = new unify.theme.Theme({
        styles: {
          "a" : {
            style : function(state) {
              return {
                a : true
              };
            }
          },
          "a/test" : {
            style : function(state) {
              return {
                atest : true
              };
            }
          },
          "b" : {
            include : "a"
          },
          "c" : {
            include : "a"
          },
          "c/test" : {
            style : function(state) {
              return {
                ctest : true
              };
            }
          }
        }
      });
      
      equal(t.resolveStyle("a").a, true, "Appearance a style a");
      equal(t.resolveStyle("a/test").atest, true, "Appearance a/test style atest");
      equal(t.resolveStyle("b/test").atest, true, "Appearance b/test style atest");
      equal(t.resolveStyle("c/test").atest, null, "Appearance c/test style atest");
      equal(t.resolveStyle("c/test").ctest, true, "Appearance c/test style ctest");
    });
    
    test("inherited styles", function() {
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
      
      equal(t2.resolveStyle("a").a1, true, "Appearance a style a1");
      equal(t2.resolveStyle("a").a2, true, "Appearance a style a2");
      equal(t2.resolveStyle("a").a3, "2", "Appearance a style a3");
    });
    
  }
});
