import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {

  private baseUrl = 'https://localhost:7262/api/Cart';

  constructor(private http: HttpClient) {}

  // 🔐 AUTH HEADERS
  private getAuthHeaders() {
    const token = localStorage.getItem("token");

    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  // ✅ GET CART (AUTH REQUIRED)
  getCart(): Observable<any> {
    return this.http.get(this.baseUrl, this.getAuthHeaders());
  }

  // ✅ ADD TO CART
  addCart(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data, this.getAuthHeaders());
  }

  // ✅ DELETE CART ITEM
  deleteCart(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, this.getAuthHeaders());
  }
}