import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class StateAreaService {

  constructor(private http: HttpClient) { }
  baseURL = environment.baseURL;

  getAllStates() {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.baseURL + '/states/getAllStates')
        .subscribe(
          async json => {
            resolve(json);
          },
          error => {
            reject(error);
          }
        );
    });
  }

  getStateByID(idstates) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/states/getStateByID', { idstates: idstates })
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

  getAreaByID(idareas) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/states/getAreaByID', { idareas: idareas })
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


  getAreasByStatesID(idstates) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/states/getAreasByStatesID', { idstates: idstates })
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

  createState(state) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/states/createState', { stateName: state.state, status: state.stateStatus })
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

  editState(idstates, name, status) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/states/editState', { idstates: idstates, name: name, status: status })
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

  createArea(area) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/states/createArea', { name: area.area, idstates: area.state, status: area.areaStatus })
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

  editArea(area) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/states/editArea', { area: area })
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

  deleteState(state) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/states/deleteState', { state: state })
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

  deleteArea(area) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/states/deleteArea', { area: area })
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
