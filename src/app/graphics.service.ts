import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
@Injectable()
export class GraphicsService {
  map: any;
  mapView: any;
  graphicsLayer: any;

  public map$ = new BehaviorSubject(null);

  constructor() {}

  initMap() {
    const _self = this;
    (<any>window).require(
      ["esri/Map", "esri/views/MapView", "esri/Graphic", "dojo/domReady!"],
      function(Map, MapView, Graphic) {
        _self.map = new Map({
          basemap: "hybrid"
        });

        _self.mapView = new MapView({
          center: [-80, 35],
          container: "viewDiv",
          map: _self.map,
          zoom: 3
        });

        _self.map$.next(_self);
      }
    );
  }

  getMap() {
    return this.map;
  }
  getMapView() {
    return this.mapView;
  }

  generatePolyLine(points: [number[], number[], number[]], entityType: string) {
    return { type: entityType, paths: points };
  }
  generateLineSymbol(lineType: string, color: number[], width: number) {
    return {
      type: "simple-line",
      color: color,
      width: width
    };
  }
  generateLineAttributes(name: string, age: number) {
    return {
      name: name,
      age: age
    };
  }
  generateGraphic() {
    const polyline = this.generatePolyLine(
      [[-111.3, 52.68], [-98, 49.5], [-93.94, 29.89]],
      "simple-line"
    );
    const linesymbol = this.generateLineSymbol(
      "simple-line",
      [227, 119, 40],
      4
    );
    const lineAttrs = this.generateLineAttributes("Boaz", 34);
    const popupTemplate = {
      title: "{Name}",
      content: [
        {
          type: "fields",
          fieldInfos: [
            {
              fieldName: "Name"
            },
            {
              fieldName: "Owner"
            },
            {
              fieldName: "Length"
            }
          ]
        }
      ]
    };

    return {
      geometry: polyline,
      symbol: linesymbol,
      attributes: lineAttrs,
      popupTemplate: popupTemplate
    };
  }

  // Create a symbol for drawing the line
  // var lineSymbol = {
  //   type: "simple-line", // autocasts as SimpleLineSymbol()
  //   color: [226, 119, 40],
  //   width: 4
  // };

  // Create an object for storing attributes related to the line
  // var lineAtt = {
  //   Name: "Keystone Pipeline",
  //   Owner: "TransCanada",
  //   Length: "3,456 km"
  // };
}
