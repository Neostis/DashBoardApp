import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MongoDBService {
  private baseUrl = 'http://localhost:5000'; // Update with your backend URL

  constructor(private http: HttpClient) {}

  // Get all files
  getFiles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/get-files`).pipe(
      catchError((error) => {
        console.error('Error getting files:', error);
        return throwError(error);
      })
    );
  }

  // Get content of a single file
  getFileContent(fileId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-file/${fileId}`, { responseType: 'arraybuffer' }).pipe(
      catchError((error) => {
        console.error('Error getting file content:', error);
        return throwError(error);
      })
    );
  }
  // Example endpoint for uploading a file
  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.baseUrl}/upload-files`, formData).pipe(
      catchError((error) => {
        console.error('Error uploading file:', error);
        return throwError(error);
      })
    );
  }

  // Add more methods for other endpoints as needed
}
