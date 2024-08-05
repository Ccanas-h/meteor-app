import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  // private http = inject(HttpClient);
  constructor(private http : HttpClient){}

  public get(url:string) {
    return this.http.get(url).pipe(
      take(1)
    );
  }

}
