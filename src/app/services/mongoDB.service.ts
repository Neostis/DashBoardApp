import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { TaskModel } from '../model/task.model';
import { PaymentModel } from '../model/payment.model';
import { catchError, map } from 'rxjs/operators';
import { FilesModel } from '../model/files.model';
import { MemberModel } from '../model/member.model';

@Injectable({
  providedIn: 'root',
})
export class MongoDBService {
  // private baseUrl = 'http://localhost:5000'; // Update with your backend URL

  private baseUrl = 'https://cmtzzjeef.execute-api.ap-southeast-2.amazonaws.com/prod'; // Update with your backend URL

  constructor(private http: HttpClient) {}

  // Get all files
  getFiles(): Observable<FilesModel[]> {
    return this.http
      .get(`${this.baseUrl}/get-files`, { responseType: 'text' })
      .pipe(
        map((response) => {
          const decodedResponse = JSON.parse(atob(response));
          return decodedResponse.map((item: any) => ({
            _id: item._id,
            length: item.length,
            chunkSize: item.chunkSize,
            uploadDate: new Date(item.uploadDate),
            filename: item.filename,
            contentType: item.contentType,
            metadata: {
              title: item.metadata.title,
              type: item.metadata.type,
              lastModified: item.metadata.lastModified,
              projectId: item.metadata.projectId,
            },
          }));
        }),
        catchError((error) => {
          console.error('Error getting files:', error);
          return throwError(() => error);
        })
      );
  }

  // Test
  // getFiles(): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.baseUrl}/get-files`).pipe(
  //     catchError((error) => {
  //       console.error('Error getting files:', error);
  //       return throwError(() => error);
  //     })
  //   );
  // }

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
    return this.http
      .get(`${this.baseUrl}/get-projects/`, { responseType: 'text' })
      .pipe(
        map((response) => JSON.parse(atob(response))),
        catchError((error) => {
          console.error('Error getting projects:', error);
          return throwError(() => error);
        })
      );
  }

  // Test
  // getProjects(): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.baseUrl}/get-projects/`).pipe(
  //     catchError((error) => {
  //       console.error('Error getting projects:', error);
  //       return throwError(() => error);
  //     })
  //   );
  // }

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
  // getMembers(role: string): Observable<any> {
  //   return this.http.get(`${this.baseUrl}/get-members/${role}`, { responseType: 'text' }).pipe(
  //     catchError((error) => {
  //       console.error('Error getting projects:', error);
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
          return throwError(() => error);
        })
      );
  }

  getProjectMembers(projectId?: string): Observable<MemberModel[]> {
    return this.http
      .get(`${this.baseUrl}/members/getProjectMembers?Id=${projectId}`, { responseType: 'text' })
      .pipe(
        map((response) => {
          const decodedResponse = JSON.parse(atob(response));
          
          return decodedResponse.map((item: any) => ({
            name: item.name,
            role: item.role,
            email: item.email,
            projects: item.projects.map((project: any) => ({
              projectId: project.projectId,
              type: project.type,
            }))
          })) as MemberModel[];
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('An error occurred:', error);
          return throwError(() => error);
        })
      );
  }

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
        return throwError(() => error);
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

  updateTaskStatus(taskId: string, status: string): Observable<any> {
    const url = `${this.baseUrl}/update-task-status/${taskId}`;
    return this.http.put<any>(url, { status: status }).pipe(
      catchError((error) => {
        console.error('Error updating task Status:', error);
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
        return throwError(() => error);
      })
    );
  }

  updatePayment(payment: PaymentModel): Observable<PaymentModel> {
    const url = `${this.baseUrl}/update-payment`;
    return this.http.post<PaymentModel>(url, payment).pipe(
      catchError((error: any) => {
        console.error('An error occurred:', error);
        return throwError(() => error);
      })
    );
  }
}
