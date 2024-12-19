import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private cookie: CookieService) { }

  public getImageProfile(): Promise<string | ArrayBuffer | null> {
    const userId = this.cookie.get("id");
    const headers = this.getHeaders();

    return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
      this.http.get<Blob>(`/api/v1/users/download-image-profile/${userId}`, { headers, responseType: 'blob' as 'json' })
        .subscribe(
          (data) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve(reader.result); // Resolve a URL de dados
            };
            reader.onerror = () => {
              reject('Error reading file'); // Rejeita a Promise em caso de erro
            };
            reader.readAsDataURL(data); // Converte o Blob para uma URL de dados
          },
          (error) => {
            console.error('Error fetching image:', error);
            reject('Error fetching image'); // Rejeita a Promise em caso de erro na solicitação HTTP
          }
        );
    });
  }

  public getImageProfileByUserId(userId: number): Promise<string | undefined> {
    const headers = this.getHeaders();
  
    return new Promise<string | undefined>((resolve, reject) => {
      this.http.get<Blob>(`/api/v1/users/download-image-profile/${userId}`, { headers, responseType: 'blob' as 'json' })
        .subscribe(
          (data) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              // Converter ArrayBuffer ou null para string ou undefined
              const result = reader.result;
              resolve(result ? result as string : undefined);
            };
            reader.onerror = () => {
              reject('Error reading file'); // Rejeita a Promise em caso de erro
            };
            reader.readAsDataURL(data); // Converte o Blob para uma URL de dados
          },
          (error) => {
            console.error('Error fetching image:', error);
            reject('Error fetching image'); // Rejeita a Promise em caso de erro na solicitação HTTP
          }
        );
    });
  }
  private getHeaders(): HttpHeaders {
    const token = this.cookie.get('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
}
