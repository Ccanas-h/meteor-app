import { Component, inject, signal } from '@angular/core';

import { WeatherService } from '../services/weather.service';
import { formatDate } from '@angular/common';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  weatherIcons = {
    despejado: 'sunny',
    parcialSoleado: 'partly-sunny',
    soleado: 'sunny',
    lluvioso: 'rainy',
    nuboso: 'cloud',
    ventoso: 'cloudy',
  };

  // private _weather = inject(WeatherService);
  tiempo: any;
  diaSeleccionado: any = signal(null);

  latitude: string = '';
  longitude: string = '';
  temperaturasDiarias: any = [];

  currentPosition: any;

  constructor(private _weather: WeatherService) { }

  async ngOnInit() {
    this.currentPosition = await (this.printCurrentPosition());
    console.log("currentPosition ", this.currentPosition);
    this.latitude = formatNumber(this.currentPosition?.coords?.latitude);
    console.log("latitude ", this.latitude);
    this.longitude = formatNumber(this.currentPosition?.coords?.longitude);
    console.log("longitude ", this.longitude);


    this._weather.getWeather(this.latitude, this.longitude).subscribe(data => {
      console.log("data ", data);
      this.tiempo = data;
      this.procesarDatosDeTiempo();
    });

  }

  printCurrentPosition = async () => {
    const coordinates = await Geolocation.getCurrentPosition();
    // console.log('Current position:', coordinates);
    return coordinates;
  };


  procesarDatosDeTiempo() {
    const horas = this.tiempo.hourly.time;
    const temperaturas = this.tiempo.hourly.temperature_2m;
    const humedades = this.tiempo.hourly.relative_humidity_2m;

    //Agrupa en un objeto cada dia con sus respectivas temperaturas y humedades
    const groupedByDay = this.groupByDay(horas, temperaturas, humedades);

    //Luego promedia esas temperaturas y humedades por dia.
    this.temperaturasDiarias = this.calcularPromediosDiarios(groupedByDay);
    console.log(this.temperaturasDiarias);
  }

  groupByDay(times: string[], temperatures: number[], humidities: number[]) {
    const grouped: { [key: string]: { temps: number[], hums: number[] } } = {};

    times.forEach((time, index) => {
      const date = new Date(time);
      //  console.log("date ", date);
      const dia = formatDate(date, 'yyyy-MM-dd', 'es-CL');
      if (!grouped[dia]) {
        grouped[dia] = { temps: [], hums: [] };
      }
      grouped[dia].temps.push(temperatures[index]);
      grouped[dia].hums.push(humidities[index]);
    });

    return grouped;
  }

  calcularPromediosDiarios(groupedData: { [key: string]: { temps: number[], hums: number[] } }) {
    const promediosDiarios: any[] = [];
    for (const day in groupedData) {
      if (groupedData.hasOwnProperty(day)) {
        const temps = groupedData[day].temps;
        const hums = groupedData[day].hums;

        const avgTemp = temps.reduce((acc, temp) => acc + temp, 0) / temps.length;
        const avgHum = hums.reduce((acc, hum) => acc + hum, 0) / hums.length;

        promediosDiarios.push({ day, avgTemp, avgHum });
      }
    }
    return promediosDiarios;
  }


  changeDateTime(event: any) {
    this.diaSeleccionado.set(event?.value);
    console.log("event?.value ", event?.value);
  }



  getTipoClima(temp: number, hum: number): string {
    if (temp > 25 && hum < 40) {
      return this.weatherIcons.despejado;
    } else if (temp > 20 && hum < 50) {
      return this.weatherIcons.soleado;
    } else if (temp >= 15 && temp <= 20 && hum < 60) {
      return this.weatherIcons.parcialSoleado;
    } else if (temp >= 10 && temp < 20 && hum >= 60 && hum < 80) {
      return this.weatherIcons.ventoso;
    } else if (temp >= 10 && temp < 15 && hum > 60) {
      return this.weatherIcons.nuboso;
    } else if (hum > 80) {
      return this.weatherIcons.lluvioso;
    } else {
      return this.weatherIcons.nuboso; 
    }
  }

}

function formatNumber(num: string | number): string {
  num = num?.toString();
  const isNegative = num.startsWith('-');
  const baseLength = isNegative ? 5 : 4;
  const numLength = num.replace('-', '').replace('.', '').length;
  const hasDecimal = num.includes('.');

  if (hasDecimal && num.split('.')[1].length < 2) {
    return num + '0';
  } else if (numLength < baseLength || (!hasDecimal && numLength === baseLength)) {
    return num + '0';
  } else if (numLength > baseLength) {
    return num.slice(0, baseLength + 1);
  } else {
    return num;
  }
}
