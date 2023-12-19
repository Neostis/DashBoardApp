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
        return throwError(() => error);
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
          return throwError(() => error);
        })
      );
  }

  getProjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/get-projects/`).pipe(
      catchError((error) => {
        console.error('Error getting projects:', error);
        return throwError(() => error);
      })
    );
  }

  // Example endpoint for uploading a file
  uploadFile(file: File, projectId: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http
      .post(`${this.baseUrl}/upload-files/${projectId}`, formData)
      .pipe(
        catchError((error) => {
          console.error('Error uploading file:', error);
          return throwError(() => error);
        })
      );
  }

  //use role = '""' for all data
  getMembers(role: string): Observable<any> {
    return this.http.get<any[]>(`${this.baseUrl}/get-members/${role}`).pipe(
      catchError((error) => {
        console.error('Error getting projects:', error);
        return throwError(() => error);
      })
    );
  }

  addMember(memberData: any): Observable<any> {
    const url = `${this.baseUrl}/add-member`; // Assuming your server has an endpoint like /add-member
    return this.http.post<any>(url, memberData).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('An error occurred:', error);
        return throwError(
          () => 'Something went wrong; please try again later.'
        );
      })
    );
  }

  updateMemberRole(memberId: string, newRole: string): Observable<any> {
    
    return this.http
      .put<any>(`${this.baseUrl}/update-member/${memberId}`, { role: newRole })
      .pipe(
        catchError((error) => {
          console.error('Error updating member role:', error);
          return throwError(() => error);
        })
      );
  }

  searchMember(searchTerm?: string, projectId?: string): Observable<any[]> {
    return this.http
      .get<any[]>(
        `${this.baseUrl}/members/search?name=${searchTerm}&Id=${projectId}`
      )
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
}
