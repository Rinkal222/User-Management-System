import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private _http: HttpClient, private _snackBar: MatSnackBar) { }

  // Using API instead of localStorage for better scalability and real-time data sync

  addUser(data: any): Observable<any> {
    return this._http.post('http://localhost:3000/users', data)
  }

  getUser(): Observable<any> {
    return this._http.get('http://localhost:3000/users').pipe(
      catchError(error => {
        this._snackBar.open("Failed to load users. Please try again.", "Close", { duration: 3000 });
        return throwError(error);
      })
    );
  }

  updateUsers(id: number, data: any): Observable<any> {
    return this._http.put(`http://localhost:3000/users/${id}`, data);
  }
  deleteUsers(id: number): Observable<any> {
    return this._http.delete(`http://localhost:3000/users/${id}`);
  }
  applyFilter(data: any[], filterValue: string): any[] {
    filterValue = filterValue.trim().toLowerCase();
    return data.filter(user =>
      user.userName.toLowerCase().includes(filterValue) ||
      user.email.toLowerCase().includes(filterValue)
    );
  }
}
