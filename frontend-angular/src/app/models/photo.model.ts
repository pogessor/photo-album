export interface Photo {
  id: number;
  year: number;
  description: string | null;
  filename: string;
  originalFilename: string | null;
  uploadedAt: string;
}
