import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardsService {
  private apiURL = 'https://localhost:44307/api/Card/';

  constructor(private http:HttpClient) { }

  getListCards(): Observable<any>{
    return this.http.get(this.apiURL)
  }

  deleteCard(id:number): Observable<any>{
    return this.http.delete(this.apiURL + id)
  }

  addCard(card:any): Observable<any>{
    return this.http.post(this.apiURL, card)
  }

  updateCard(id:number, card:any): Observable<any>{
    return this.http.put(this.apiURL + id, card)
  }

}
