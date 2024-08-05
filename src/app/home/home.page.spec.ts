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
        provideHttpClient,
        provideHttpClientTesting,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Debería obtener la posición actual', waitForAsync(async () => {
    // Llama a la función printCurrentPosition
    const position = await component['printCurrentPosition']();

    // Verifica que la función de Geolocation haya sido llamada
    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();

    // Verifica que el resultado sea el esperado
    expect(position.coords).toEqual({
      latitude: 40.7128,
      longitude: -74.0060,
      accuracy: 50,
      altitude: null,
      altitudeAccuracy: null,
      speed: null,
      heading: null
    });
  }));
});
