import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SpotifyService } from "src/app/services/spotify.service";

@Component({
  selector: "app-artista",
  templateUrl: "./artista.component.html",
  styles: []
})
export class ArtistaComponent implements OnInit {
  artista: any;
  loading = true;
  constructor(
    private route: ActivatedRoute,
    private spotifyService: SpotifyService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.spotifyService.getArtista(params["id"]).subscribe(artista => {
        this.artista = artista;
        this.loading = false;
      });
    });
  }
}
