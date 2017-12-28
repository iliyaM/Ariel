import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { GraphicsService } from './graphics.service';
import { PapaParseModule, PapaParseService } from 'ngx-papaparse';
import { LineService } from './line.service';
import { AgmCoreModule } from '@agm/core';


import { KeyValuePipe } from './keys.pipe';

@NgModule({
  declarations: [
    AppComponent,
    KeyValuePipe
  ],
  imports: [
    BrowserModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC5WUIktcF2C1s9owVRoAVhYBfpeFTYD5s'
    })
  ],
  providers: [GraphicsService, PapaParseService, LineService],
  bootstrap: [AppComponent]
})
export class AppModule { }
