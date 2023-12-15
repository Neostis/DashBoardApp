import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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
    return this.http
      .get(`${this.baseUrl}/get-file/${fileId}`, {
        responseType: 'arraybuffer',
      })
      .pipe(
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

  searchMember(searchTerm?: string): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.baseUrl}/members/search?name=${searchTerm}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('An error occurred:', error);
          return throwError(
            () => 'Something went wrong; please try again later.'
          );
        })
      );
  }

  /**
   * The `deleteFile` function sends a DELETE request to the server to delete a file with the specified
   * `fileId`.
   * @param {string} fileId - A string representing the unique identifier of the file that needs to be
   * deleted.
   * @returns The deleteFile function returns an Observable<any>.
   */
  deleteFile(fileId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete-file/${fileId}`);
  }

  // Add more methods for other endpoints as needed
}
