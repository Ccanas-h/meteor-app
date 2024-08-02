import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { Geolocation } from '@capacitor/geolocation';
import { HomePage } from './home.page';
import { WeatherService } from '../services/weather.service';
import { of } from 'rxjs';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;



  // Mock de Geolocation
  const mockGeolocation = {
    getCurrentPosition: jasmine.createSpy('getCurrentPosition').and.returnValue(Promise.resolve({
      coords: {
        latitude: 40.7128,
        longitude: -74.0060
      }
    }))
  };


  // Mock del WeatherService
  const mockWeatherService = {
    getWeather: jasmine.createSpy('getWeather').and.returnValue(of({
      hourly: {
        time: [],
        temperature_2m: [],
        relative_humidity_2m: []
      }
    }))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomePage],
      providers: [
        { provide: WeatherService, useValue: mockWeatherService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('Deberia obtener la posición actual', async () => {
    // Llama a la funcion printCurrentPosition
    const position : any = await component['printCurrentPosition']();

    // Verifica que la función de Geolocation haya sido llamada
    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();

    // Verifica que el resultado sea el esperado
    expect(position).toEqual({
      coords: {
        latitude: 40.7128,
        longitude: -74.0060
      }
    });
  });






  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
