import { Component, OnInit } from '@angular/core';
import { LineService } from './line.service';

interface MarkerObject {
	lat: number;
	lng: number;
	color: string;
}

@Component({
	selector: 'app-root',
	// templateUrl: './app.component.html',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.less'],
})

export class AppComponent implements OnInit {
	zoom = 11;
	lat: 32.7157;
	lng: -117.1611;

	markers;
	markerInfo: MarkerObject;
	legend;
	selectedColorsType;
	constructor(private lineService: LineService) { }

	ngOnInit() {
		this.lineService.mapDataObjects.subscribe(response => {
			this.markers = response;
			this.lineService.colorize('conductor_material');
		});

		this.lineService.lengedArray$.subscribe(response => {
			this.legend = response;
		});
	}

	selectedFilter(value) {
		this.lineService.colorize(value);
	}

	clickedMarker(selectedMarker) {
		console.log(selectedMarker);
		console.log(this.markerInfo);
		this.markerInfo = selectedMarker;
	}


	fileChange(file) {
		console.log(file);
		this.lineService.readFile(file);
	}

}

