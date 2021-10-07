import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  baseURL = environment.baseURL;

  constructor(
    private http: HttpClient
  ) { }
  public uploadImage(image: File) {
    const formData = new FormData();

    formData.append('image', image);

    // return this.http.post('/api/v1/image-upload', formData);
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/uploadImage', formData)
        .subscribe(
          json => {
            resolve(json);
          },
          error => {
            reject(error);
          }
        );
    });
    
  }
}


// export class ImageService {

//   constructor(private http: Http) {}


//   public uploadImage(image: File): Observable<Response> {
//     const formData = new FormData();

//     formData.append('image', image);

//     return this.http.post('/api/v1/image-upload', formData);
//   }
// }
