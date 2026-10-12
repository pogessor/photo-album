import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Photo } from "../models/photo.model";

@Injectable({
  providedIn: "root",
})
export class PhotoService {
  private http = inject(HttpClient);
  private readonly apiUrl = "/api/photos";

  getAll(): Observable<Photo[]> {
    return this.http.get<Photo[]>(this.apiUrl);
  }

  getById(id: number): Observable<Photo> {
    return this.http.get<Photo>(`${this.apiUrl}/${id}`);
  }

  search(keyword: string): Observable<Photo[]> {
    return this.http.get<Photo[]>(`${this.apiUrl}/search`, {
      params: { keyword },
    });
  }

  upload(file: File, year: number, description: string): Observable<Photo> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("year", year.toString());
    if (description) {
      formData.append("description", description);
    }
    return this.http.post<Photo>(this.apiUrl, formData);
  }

  describe(file: File): Observable<{ description: string }> {
    const formData = new FormData();
    formData.append("file", file);
    return this.http.post<{ description: string }>(
      `${this.apiUrl}/describe`,
      formData,
    );
  }

  update(id: number, year: number, description: string): Observable<Photo> {
    return this.http.patch<Photo>(`${this.apiUrl}/${id}`, {
      year,
      description,
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getImageUrl(id: number): string {
    return `${this.apiUrl}/${id}/image`;
  }
}
