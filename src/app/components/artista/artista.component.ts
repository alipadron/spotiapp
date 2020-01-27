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
  topTracks: any[] = [];
  loading = true;
  constructor(
    private route: ActivatedRoute,
    private spotifyService: SpotifyService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.getArtista(params["id"]);
      this.getTopTracks(params["id"]);
    });
  }

  getArtista(id: string) {
    this.spotifyService.getArtista(id).subscribe((artista: any) => {
      this.artista = artista;
      this.loading = false;
    });
  }

  getTopTracks(id: string) {
    this.spotifyService
      .getTopTracks(id)
      .subscribe((topTracks: any[]) => (this.topTracks = topTracks));
  }
}
