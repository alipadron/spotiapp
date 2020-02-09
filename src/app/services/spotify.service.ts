import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, pipe, EMPTY, BehaviorSubject } from "rxjs";
import { map, catchError, tap, switchMap, filter, take } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class SpotifyService {
  private clientId = "d6b55734aa3f4b49af89ae8023b6c69e";
  private clientSecret = "4659ca881ead4eed81c45197f071db34";
  private accessToken: string;
  private isGettingToken: boolean;
  private tokenSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
    this.accessToken = localStorage.getItem("access_token");
  }

  private getAccessToken() {
    if (!this.isGettingToken) {
      this.isGettingToken = true;
      const body = new HttpParams()
        .set("grant_type", "client_credentials")
        .set("client_id", this.clientId)
        .set("client_secret", this.clientSecret);
      return this.http
        .post("https://accounts.spotify.com/api/token", body)
        .pipe(
          tap((response: any) => {
            this.isGettingToken = false;
            this.tokenSubject.next(response);
          })
        );
    } else {
      return this.tokenSubject.pipe(
        filter(token => token != null),
        take(1)
      );
    }
  }

  getQuery(query: string) {
    const url = `https://api.spotify.com/v1/${query}`;

    if (this.accessToken) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.accessToken}`
      });
      return this.http.get(url, { headers }).pipe(
        catchError(err => {
          // Unauthorized means token has expired
          if (err.status === 401) {
            return this.getAccessToken().pipe(
              switchMap((response: any) => {
                this.accessToken = response.access_token;
                localStorage.setItem("access_token", response.access_token);
                return this.getQuery(query);
              })
            );
          } else {
            throw Error("Error desconocido");
          }
        })
      );
    } else {
      return this.getAccessToken().pipe(
        switchMap((response: any) => {
          this.accessToken = response.access_token;
          localStorage.setItem("access_token", response.access_token);
          return this.getQuery(query);
        })
      );
    }
  }

  getNewReleases() {
    return this.getQuery("browse/new-releases?limit=20").pipe(
      map((data: any) => data.albums.items)
    );
  }

  getArtistas(termino: string) {
    return this.getQuery(`search?q=${termino}&type=artist&limit=15`).pipe(
      map((data: any) => data.artists.items)
    );
  }

  getArtista(id: string) {
    return this.getQuery(`artists/${id}`);
  }

  getTopTracks(id: string) {
    return this.getQuery(`artists/${id}/top-tracks?country=us`).pipe(
      map((data: any) => data.tracks)
    );
  }
}
