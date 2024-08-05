import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { Geolocation } from '@capacitor/geolocation';
import { HomePage } from './home.page';
import { WeatherService } from '../services/weather.service';
import { of } from 'rxjs';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  // Mock de Geolocation
  const mockGeolocation = {
    getCurrentPosition: jasmine.createSpy('getCurrentPosition').and.returnValue(Promise.resolve({
      coords: {
        latitude: 40.7128,
        longitude: -74.0060,
        accuracy: 50,
        altitude: null,
        altitudeAccuracy: null,
        speed: null,
        heading: null
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

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])],
      providers: [
        { provide: WeatherService, useValue: mockWeatherService },
        { provide: Geolocation, useValue: mockGeolocation }, // Aquí incluimos el mock,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));


  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('Debería verificar que existan datos tras llamada a API Weather', waitForAsync(async (done: any) => {
    try {

      const position = await component['printCurrentPosition']();

      expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();

      expect(typeof position.coords.latitude).toBe('number');

      // expect(position.coords.latitude).toBe(40.7128);
      // expect(position.coords.longitude).toBe(-74.0060);

      done();
    } catch (error) {
      console.error("Error: 2", error);
      done.fail(error);
    }
  }));


  it('should format numbers correctly', () => {

    const testCases = [
      { input: 5, expected: '5' }, 
      { input: 5.1, expected: '5.1' }, 
      { input: 5.123, expected: '5.123' }, 
      { input: -5, expected: '-5' }, 
      { input: -5.1, expected: '-5.1' }, 
      { input: -5.123, expected: '-5.123' }, 
      { input: 123.456789, expected: '123.45' } // Test caso con más de 5 dígitos
    ];
    
    testCases.forEach(({ input, expected }) => {
      const result = component.formatLatitudLongitud(input);
      console.log(`Expected ${expected} but got ${result} for input ${input}`);
      expect(result).toBe(expected);
    });
  });



});
