import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, pipe } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class SpotifyService {
  constructor(private http: HttpClient) {}

  getNewReleases() {
    const headers = new HttpHeaders({
      Authorization:
        "Bearer BQA9ssAXcP-nyzT0lptDG4N7AROb2MMf8MN6l0qjOvmGOr6P3xFC2A61-EQ1tkcGmnwAquVxNp8FTOkNrmg"
    });
    return this.http
      .get("https://api.spotify.com/v1/browse/new-releases", {
        headers
      })
      .pipe(map((data: any) => data.albums.items));
  }

  getArtista(termino: string) {
    const headers = new HttpHeaders({
      Authorization:
        "Bearer BQA9ssAXcP-nyzT0lptDG4N7AROb2MMf8MN6l0qjOvmGOr6P3xFC2A61-EQ1tkcGmnwAquVxNp8FTOkNrmg"
    });
    return this.http
      .get(
        `https://api.spotify.com/v1/search?q=${termino}&type=artist&limit=15`,
        {
          headers
        }
      )
      .pipe(map((data: any) => data.artists.items));
  }
}
