import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Photo } from "../../models/photo.model";
import { PhotoCardComponent } from "../photo-card/photo-card";

@Component({
  selector: "app-gallery",
  imports: [PhotoCardComponent],
  templateUrl: "./gallery.html",
  styleUrl: "./gallery.css",
})
export class GalleryComponent {
  @Input({ required: true }) photos!: Photo[];
  @Output() select = new EventEmitter<Photo>();
  @Output() delete = new EventEmitter<Photo>();

  onSelect(photo: Photo): void {
    this.select.emit(photo);
  }

  onDelete(photo: Photo): void {
    this.delete.emit(photo);
  }
}
