import { Component, OnInit } from "@angular/core";
import { SpotifyService } from "src/app/services/spotify.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styles: []
})
export class HomeComponent implements OnInit {
  nuevasCanciones: any[] = [];
  loading = true;
  error = false;
  mensajeError: string;
  constructor(private spotifyService: SpotifyService) {}

  ngOnInit() {
    this.spotifyService.getNewReleases().subscribe(
      (data: any[]) => {
        this.nuevasCanciones = data;
        this.loading = false;
      },
      errorServicio => {
        console.log(errorServicio);
        this.loading = false;
        this.error = true;
        this.mensajeError =
          (errorServicio.error &&
            errorServicio.error.error &&
            errorServicio.error.error.message) ||
          (errorServicio.error && errorServicio.error.message) ||
          errorServicio.message;
      }
    );
  }
}
