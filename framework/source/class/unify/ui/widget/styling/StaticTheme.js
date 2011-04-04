qx.Class.define("unify.ui.widget.styling.StaticTheme", {
  type : "static",

  statics : {
    layer : {
      background : "#eee"
    },

    navigationBarButton : {
      WebkitBorderImage : "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAA8CAYAAACw00AzAAAACXBIWXMAAAsTAAALEwEAmpwYAAACrElEQVRIDe2Wv4saQRTHZ3dHEeOPO1FQQUFBOCsLxVjcYZXCJoWFXfoU18iVFkf+AE8CV1yRLr1F2hQWx4FYHxgQLBTUQiWKiL/N+463Ri6s7haBFHkwzDjvM+/ePN58b6Xtdstg4XA4KcvyJ1q+kyRJof01rb9vNpvbZrNZAyMBJvDa6XQWo9Go2e/3M4IZ9judDqvX64vRaHRDB+6lYDB4GQgEHpPJJLPZbMxsNiOIsMViwSaTCavVaqzdbl8poVDoIZFIRM7OzgSwXq+ZOrCBw3a7nQ0GAx93uVwpREQULYMfHLdareer1UqL2++D44qisOVyud/UWoDjiDqfz7WY/T44AeuJbBxGmfREBscBHiubmjQ4jhN6Sici/z14PB4zakM1Nc0ZDcXhRUvqMVkPpDIcUfVEBmMosiH4H0lD5pz/VLVDLdHrGX5wssPheEZ/HDP4wcmZTOaO2u/oi4UfnFKpVNrVatXaarXeUuFhe0VCxNlstonH45/Jvgj5ohT8pVLpfblc/jAcDi+ov12U45C04kc2m/2az+e/EdNRYaTsoBF8maFhUJ0xjdbLvOs6+sF8Pt8FTX+oKO3ddrvd3ypK4DVJVDESiZi9Xi8j6RU93uv1WKPRWFAv39CBe8nj8Vy63e7HVCrFSKKYyWTCHxKGRzqdThkVgPX7/SuFIj3EYrEIXUZUAa9GHagMVBRB6OI+brFYUpDbYy8cfnCc8jtHpFPaAQ6wLkUCxxEVFzll4IxJrqHIaJZTl0OK4IQw6sl5DxuKrBs2ckEo4u4//alCk9+QIv2HDytqrBpQx8PTWmuhoiQDz1rA4T44OZfL3dGTP6qi8IPD99ubdDpdpCgQafTJ67GGH5z42KOFv1AofKQPwCdSpAEOYMZv7MNPY/fFSE7YSRX9BVenqmVadcVvAAAAAElFTkSuQmCC') 0 5 30 5",
      borderRight : "5px",
      borderTop : "0px",
      borderBottom : "0px",
      borderLeft : "5px",
      marginLeft : "6px",
      marginRight: "4px",
      marginTop : "8px",
      marginBottom : "8px",
      font : "12px bold",
      textDecoration : "none",
      lineHeight : "20px",
      paddingLeft : "4px",
      paddingTop : "4px",
      paddingRight : "4px",
      paddingBottom : "4px",
      color : "white",
      textShadow : "rgba(0,0,0,0.5) 0px -1px 0",
      whiteSpace : "nowrap",
      cursor : "default",
      textAlign : "center"
    },

    navigationBarButtonParent : {
      WebkitBorderImage : "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAA8CAYAAACJtPFoAAAACXBIWXMAAAsTAAALEwEAmpwYAAAE60lEQVRYCa2YTUhjVxTHbz400cSPqDHR6Gj82jgUUYhWpgYRocaFrQzCLLIxUGZTrXVhJdChILSbKZ1SiO1IZHDRlUPppgOVwlCKoowbRzIgdREhRmrtWMWPaGL/59IXny8fvpfkws297717f+/cc84997yorq6umJxSVVVlNhgMXowdVKlUTcIczI+i/2ssFnu0vb29SvdVcqCNjY338vLynjc3N5urq6tZcXGxwGQ0PxQKsUAgEDk8PJwE+LtbobW1tQ6z2fyyq6tLbzKZWH5+PtNoNHEodSKRCDs+Pmarq6tsZ2fnvbRQAG2lpaWvenp6LGVlZQzLvgGTXuzv77Pl5eVftNIHwjUgJeXl5S/a29stRUVF7OLiQniUsjUajQzzulJCS0pKfHdRaMm0PLmlsLDQlBQKS99vamp6gJZFo1Fe5UJJ3wlQch3o8YeGhgZ2eXnJq1wgjaM5CVC4zlNIaVKr1bL0KH1hAtRisbjr6uqGyA/lGEYKTJC0oqLCBqN8a7PZFC9ZDCcbxJev0+me1dTUlNIAJdYWA6lPK+RQ+KMHwD7s7aykJCiXFJa2wyefVFZWKnIdAiQrHKrX6/0IEgYaQJbLtnAotpWGgsHZ2Vm2PD6fWGqfzzeFq10KYRQwsq1E1szPz4dPT0/Da2trLjh+3Bv4azP4Ic8RQp/R4/F4V1ZWPoOOM0BdTzk6OopD6a61v79/dm9vbwgSX49S2COoWjQnDP16EdnfkAWzKWIoQyAJjI+PT8K13hI0U6PdgIITc7vdvw0ODn4B48UylVYwlHS+aWRk5CuckB8hJkifpb2WGko6+E5vb6//4OCgT67hyNexid5Kly8GB/1+/6cAyjYcGRix+HU6KLPb7a+npqYmkH3so4pfmLSPsHc5MDDwdSqdiifpFhcXB2ZmZh5DkgatVsvoqBEKLZkkxE6KdXR0fLOwsPC5HCjN129sbHROT08/DAaDzvPz8yoBipccICi9GR4eXpiYmPgZ90NyocSgXKce1Ywq3suUFPyLGvy/vT5OcCNtwdFdhs3wMZabNOvD5Ee7u7vysz6cCvfgr8/r6+t51kdpkFDIgOFwmG1tbUUQSycBvj3rwynrwJHz0uFw6NEy8lmxoQhOh93JyQlDlGNI0tJnfXRsQ6pX3d3dFsqpKBakKyTx+vp6+qwPydaLtrY2CyUXciIXrQTxOHXWhxDoQ9S6SwOV5AFQTfKsD3nAfZywDyhbIQnlSCmohfSdcCZBhzzrQ37PyLJytqcApJbGJ0Chk6dI0kw0ADuHGkUlIetDpuK2Wq1DpMdMs74bksLS9NHAs75MgbQk0n98+QUFBc8gJc/6cgJFtufBt1IfwIrcJ5myuaQA2QF9AjfKWI9iOIdiL/sRDw2ZuI8YJvS5oRBkNYgwwr3ctEtLS+9CBSHQ6HM6NxVBV4tjwo0IRAlqzqD0eW10uVxf5hpKYGtLS8tPOQEDxv8IoHZzc7MVwTiQNVgMRV89Ozvrgkf8kxVYAiWp9aOjo58ASklqZoZLAiWwqbOz8/tcQwl8B2VJKZirLoWk3Hj45+YdpYZDpPudT04DVs/Nzb2P0+AvORJjA12MjY19eBuUnusA/gBn15+3gKNOp/MxxhvkQGmMHv85OVtbW3+UxglEub9x8v7h9XofYlw16o3vKAiStsjO+v4Dyuh6GrcLCoAAAAAASUVORK5CYII=') 0 5 30 12",
      borderLeft : "12px",
      marginLeft : "6px",
      marginRight: "4px",
      marginTop : "8px",
      marginBottom : "8px",
      font : "12px bold",
      textDecoration : "none",
      lineHeight : "20px",
      paddingLeft : "4px",
      paddingTop : "4px",
      paddingRight : "4px",
      paddingBottom : "4px",
      borderTop : "0px",
      borderRight : "5px",
      color : "white",
      textShadow : "rgba(0,0,0,0.5) 0px -1px 0",
      whiteSpace : "nowrap",
      cursor : "default"
    }
  }
});
