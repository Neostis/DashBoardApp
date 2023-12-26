import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TaskModel } from '../model/task.model';
import { PaymentModel } from '../model/payment.model';

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

  // addMember(memberData: any): Observable<any> {
  //   const url = `${this.baseUrl}/add-member`; // Assuming your server has an endpoint like /add-member
  //   return this.http.post<any>(url, memberData).pipe(
  //     catchError((error: HttpErrorResponse) => {
  //       console.error('An error occurred:', error);
  //       return throwError(
  //         () => 'Something went wrong; please try again later.'
  //       );
  //     })
  //   );
  // }

  // updateMemberType(
  //   memberId: string,
  //   projectId: string,
  //   newType: string
  // ): Observable<any> {
  //   const url = `${this.baseUrl}/update-member/${memberId}`;

  //   return this.http.put<any>(url, { projectId, type: newType }).pipe(
  //     catchError((error) => {
  //       console.error('Error updating member type:', error);
  //       return throwError(() => error);
  //     })
  //   );
  // }

  addOrUpdateMember(member: any): Observable<any> {
    const url = `${this.baseUrl}/add-update-member`;
    return this.http.post<any>(url, member).pipe(
      catchError((error) => {
        console.error('Error adding/updating member:', error);
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

  getProjectMembers(projectId?: string): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.baseUrl}/members/getProjectMembers?Id=${projectId}`)
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

  addTask(task: TaskModel): Observable<any> {
    const url = `${this.baseUrl}/add-tasks`;
    return this.http.post<any>(url, task);
  }

  getTasksByProjectId(projectId: string): Observable<TaskModel[]> {
    const url = `${this.baseUrl}/get-tasks/${projectId}`;
    return this.http.get<TaskModel[]>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('An error occurred:', error);
        return throwError(
          () => 'Something went wrong; please try again later.'
        );
      })
    );
  }

  addMemberToTask(taskId: string, memberId: string): Observable<TaskModel> {
    const url = `${this.baseUrl}/add-member-to-task/${taskId}`;
    return this.http.put<TaskModel>(url, { memberId });
  }

  updateTaskTags(taskId: string, tag: string): Observable<any> {
    const url = `${this.baseUrl}/add-tags/${taskId}`;
    return this.http.put<any>(url, { tag: tag }).pipe(
      catchError((error) => {
        console.error('Error updating task tags:', error);
        return throwError(() => error);
      })
    );
  }

  removeTaskTags(taskId: string, tag: string): Observable<any> {
    const url = `${this.baseUrl}/remove-tags/${taskId}`;
    return this.http.put<any>(url, { tag: tag }).pipe(
      catchError((error) => {
        console.error('Error removing task tags:', error);
        return throwError(() => error);
      })
    );
  }

  getPayments(projectId: string): Observable<any[]> {
    const url = `${this.baseUrl}/get-payments/${projectId}`;
    return this.http.get<any[]>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('An error occurred:', error);
        return throwError(
          () => 'Something went wrong; please try again later.'
        );
      })
    );
  }

  updatePayment(payment: PaymentModel): Observable<PaymentModel> {
    const url = `${this.baseUrl}/update-payment`;
    return this.http.post<PaymentModel>(url, payment).pipe(
      catchError((error: any) => {
        console.error('An error occurred:', error);
        return throwError('Something went wrong; please try again later.');
      })
    );
  }

}
