import { Component, inject, signal, OnInit } from "@angular/core";
import { GalleryComponent } from "./components/gallery/gallery";
import { PhotoService } from "./services/photo";
import { Photo } from "./models/photo.model";

@Component({
  selector: "app-root",
  imports: [GalleryComponent],
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
export class App implements OnInit {
  private photoService = inject(PhotoService);

  photos = signal<Photo[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadPhotos();
  }

  loadPhotos(): void {
    this.loading.set(true);
    this.error.set(null);
    this.photoService.getAll().subscribe({
      next: (data: Photo[]) => {
        this.photos.set(data);
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }
}
