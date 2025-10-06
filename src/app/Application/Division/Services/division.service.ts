import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DivisionService {
  private apiBase = `${environment.apiUrl}/division`;

  constructor(private http: HttpClient) { }

  getAllDivisions(): Observable<any> {
    return this.http.get(`${this.apiBase}/list`);
  }

  getSubdivisions(id: number): Observable<any> {
    return this.http.get(`${this.apiBase}/${id}/subdivisions`);
  }

  createDivision(data: any): Observable<any> {
    return this.http.post(`${this.apiBase}/store`, data);
  }

  updateDivision(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiBase}/update/${id}`, data);
  }

  deleteDivision(id: number): Observable<any> {
    return this.http.delete(`${this.apiBase}/delete/${id}`);
  }
}
