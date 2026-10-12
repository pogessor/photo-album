import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Photo } from "../../models/photo.model";
import { PhotoService } from "../../services/photo";

@Component({
  selector: "app-photo-card",
  imports: [],
  templateUrl: "./photo-card.html",
  styleUrl: "./photo-card.css",
})
export class PhotoCardComponent {
  @Input({ required: true }) photo!: Photo;
  @Output() select = new EventEmitter<Photo>();
  @Output() delete = new EventEmitter<Photo>();

  constructor(private photoService: PhotoService) {}

  get imageUrl(): string {
    return this.photoService.getImageUrl(this.photo.id);
  }

  onSelect(): void {
    this.select.emit(this.photo);
  }

  onDelete(event: MouseEvent): void {
    event.stopPropagation();
    this.delete.emit(this.photo);
  }
}
