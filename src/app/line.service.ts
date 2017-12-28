import { Injectable } from '@angular/core';
import { PapaParseService } from 'ngx-papaparse';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

interface MarkerObject {
    lat: number;
    lng: number;
    color: string;
    conductor_material: string;
    conductor_type: string;
    insulation_type: string;
    operational_age: number;
    failure_hazard: number;
    upstream_structure_id: number;
    downstream_structure_id: number;
    feeder_id: number;
    measureLength: number;
}

@Injectable()
export class LineService {
    mapDataObjects: BehaviorSubject<Object> = new BehaviorSubject([]);
    lengedArray$: BehaviorSubject<Object> = new BehaviorSubject(undefined);

    operational_lMax: number;
    hazard_Max: number;

    MaterialMap = {
        AL: '#ADB2BD',
        CU: '#b87333'
    };
    CONDUCTOR_TYPE_MAP = {
        PECN: 'purple',
        PECNAL: '#848789',
        PECNCU: '#935C29',
        XLPEAL: '#6A6C6E',
        PIDAL: '#9D9FA1',
        PIDCU: '#C68F5C',
        XLPECNAL: '#CDCDCF'
    };

    CONTINUES_TYPE_MAP = {
        Excelent: 'green',
        Good: 'yellow',
        Bad: 'red',
    };

    ISULATION_TYPE_MAP = {
        Polyethylene: 'yellow',
        Crosslinkedpolyethylene: 'purple',
        Treeretardantcrosslinkedpolyethylene: 'green'
    };

    markersArray = [];

    constructor(private papaService: PapaParseService) { }

    readFile(files) {
        this.papaService.parse(files[0], {
            complete: ({ data }) => {
                this.constructObjectsForRender(data);
            }
        });
    }



    constructObjectsForRender(data): any {
        const header = data.shift();

        // 1. Remove last array item from array;
        data.splice(data.length - 1, data.length);

        // 1. filter empty arrays (same as 'Remove last array')
        // items = items.filter((arr) =>(arr.filter((a) => a.length).length))

        // build key-value objects
        const lines = data.map((valArray) => valArray.reduce((acc, curr, index) => {
            acc[header[index]] = curr;
            return acc;
        }, {}));

        // Check for all NaNs and remove
        const objectsToRender = lines.filter(item => {
            // tslint:disable-next-line:max-line-length
            if ((item.DOWNSTREAMSTRUCTURE_LAT && item.DOWNSTREAMSTRUCTURE_LON === 'NaN') && (item.UPSTREAMSTRUCTURE_LAT && item.UPSTREAMSTRUCTURE_LON === 'NaN')) {
                return;
            } else {
                return item;
            }
        }).map(item => {
            // tslint:disable-next-line:max-line-length
            if ((item.DOWNSTREAMSTRUCTURE_LAT && item.DOWNSTREAMSTRUCTURE_LON === 'NaN') || (item.UPSTREAMSTRUCTURE_LAT && item.UPSTREAMSTRUCTURE_LAT === 'NaN')) {
                this.markersArray.push(this.createCircleMarker(item));
            } else {
                console.log('line');
                console.log(item);
            }
        });
        this.mapDataObjects.next(this.markersArray);
        this.getMaxValueOfType();
    }

    createCircleMarker(item) {
        const marker: MarkerObject = {
            lat: Number(),
            lng: Number(),
            color: this.getGreenToRed(Number(item.OPERATIONALAGE), this.markersArray.length),
            conductor_material: item.CONDUCTORMATERIAL,
            conductor_type: item.CONDUCTORTYPE,
            insulation_type: item.INSULATIONTYPE,
            operational_age: item.OPERATIONALAGE,
            failure_hazard: item.FAILUREHAZARD,
            upstream_structure_id: item.UPSTREAMSTRUCTUREID,
            downstream_structure_id: item.DOWNSTREAMSTRUCTUREID,
            feeder_id: item.FEEDERID,
            measureLength: item.MEASUREDLENGTH,
        };

        if (item.DOWNSTREAMSTRUCTURE_LAT === 'NaN') {
            marker.lat = Number(item.UPSTREAMSTRUCTURE_LAT);
            marker.lng = Number(item.UPSTREAMSTRUCTURE_LON);
        } else {
            marker.lat = Number(item.DOWNSTREAMSTRUCTURE_LAT);
            marker.lng = Number(item.DOWNSTREAMSTRUCTURE_LON);
        }
        return marker;
    }

    getGreenToRed(value, max) {
        if (max) {
            value = value / max;
        }

        const hue = ((1 - value) * 120).toString(10);
        const color = ['hsl(', hue, ',100%,50%)'].join('');
        return color;
    }

    colorize(value) {

        switch (value) {

            case 'conductor_material':
                this.markersArray.map(marker => {
                    marker.color = this.MaterialMap[marker.conductor_material];
                });
                this.createLegend(this.MaterialMap);
                break;

            case 'conductor_type':
                this.markersArray.map(marker => {
                    marker.color = this.CONDUCTOR_TYPE_MAP[marker.conductor_type.split(' ').join('')];
                });
                this.createLegend(this.CONDUCTOR_TYPE_MAP);
                break;

            case 'insulation_type':

                this.markersArray.map(marker => {
                    marker.color = this.ISULATION_TYPE_MAP[marker.insulation_type];
                });
                this.createLegend(this.ISULATION_TYPE_MAP);
                break;

            case 'operational_age':
                this.getMaxValueOfType();
                this.markersArray.map(marker => {
                    console.log(marker);

                    marker.color = this.getGreenToRed(marker.operational_age, this.operational_lMax);
                });

                this.createLegend(this.CONTINUES_TYPE_MAP);


                break;
            case 'failure_hazrad':
                this.markersArray.map(marker => {
                    marker.color = this.getGreenToRed(marker.failure_hazard, null);
                });
                this.createLegend(this.CONTINUES_TYPE_MAP);
                break;
        }

    }

    getMaxValueOfType() {

        this.operational_lMax = 0;
        this.hazard_Max = 0;
        for (let i = 0; i < this.markersArray.length; i++) {

            const item = this.markersArray[i];
            const operational_age_Temp = Number(item.operational_age);
            const failure_hazard_Temp = Number(item.failure_hazard);
            if (operational_age_Temp > this.operational_lMax) {
                this.operational_lMax = operational_age_Temp;

            }
            if (failure_hazard_Temp > this.hazard_Max) {
                this.hazard_Max = failure_hazard_Temp;

            }
        }
    }

    createLegend(array) {
        this.lengedArray$.next(array);
    }
}
