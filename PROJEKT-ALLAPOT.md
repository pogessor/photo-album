\# Projekt állapot – Photo Album with AI-powered Descriptions



> Ez a dokumentum a projekt \*\*jelenlegi állapotát\*\* írja le. Célja, hogy egy új fejlesztő (vagy egy AI asszisztens) \*\*azonnal megértse\*\* a projektet, és folytatni tudja a munkát.



\---



\## 1. Projekt áttekintés



\*\*Név:\*\* Photo Album with AI-powered Descriptions

\*\*Cél:\*\* Személyes portfólió projekt, amely bemutatja a modern Java backend, React frontend és full-stack architektúra ismeretét.

\*\*Állapot:\*\* \~85% kész. A CRUD teljes, az AI integráció működik, a Docker setup kész. Ami hátra van: SSE real-time frissítés, JWT authentication (opcionális), screenshotok a README-hez.



\---



\## 2. Tech Stack



\### Backend

\- \*\*Java 21\*\* (LTS)

\- \*\*Spring Boot 4.1.1\*\*

\- \*\*Spring Data JPA / Hibernate 7\*\*

\- \*\*Spring Web MVC\*\*

\- \*\*Jakarta Bean Validation\*\*

\- \*\*Maven\*\* (wrapper-rel: `mvnw.cmd`)

\- \*\*springdoc-openapi 2.8.5\*\* (Swagger UI)

\- \*\*google-genai 1.x\*\* (Gemini SDK)

\- \*\*spring-dotenv 4.0.0\*\* (.env betöltés)



\### Frontend

\- \*\*React 19\*\*

\- \*\*Vite 8\*\*

\- \*\*axios 1.x\*\*

\- \*\*ESLint + Prettier\*\* (VS Code-ban konfigurálva)

\- \*\*Vanilla CSS\*\* (nincs CSS framework)



\### Adatbázis

\- \*\*PostgreSQL 16\*\* (Docker konténerben)



\### AI

\- \*\*Google Gemini 3.5 Flash Lite\*\* (`gemini-3.5-flash-lite`)

\- `ThinkingLevel.LOW` a gyors válaszért

\- Válaszidő: \~5-15 másodperc



\### DevOps

\- \*\*Docker + Docker Compose\*\* (teljes stack)

\- \*\*Nginx\*\* (frontend static file serving + reverse proxy)

\- \*\*Git + GitHub\*\* (privát repo: `https://github.com/pogessor/photo-album`)



\---



\## 3. Projekt struktúra



```

photo-album/

├── backend/                          # Spring Boot alkalmazás

│   ├── src/main/java/com/dancsopeter/photoalbum/

│   │   ├── PhotoAlbumBackendApplication.java

│   │   ├── config/

│   │   │   ├── CorsConfig.java

│   │   │   └── OpenApiConfig.java

│   │   ├── controller/

│   │   │   └── PhotoController.java

│   │   ├── dto/

│   │   │   ├── PhotoUploadRequest.java

│   │   │   ├── PhotoUpdateRequest.java

│   │   │   ├── PhotoDescriptionResponse.java

│   │   │   └── ErrorResponse.java

│   │   ├── entity/

│   │   │   └── Photo.java

│   │   ├── exception/

│   │   │   ├── PhotoNotFoundException.java

│   │   │   ├── StorageException.java

│   │   │   └── GlobalExceptionHandler.java

│   │   ├── repository/

│   │   │   └── PhotoRepository.java

│   │   └── service/

│   │       ├── PhotoService.java

│   │       ├── PhotoStorageService.java

│   │       ├── LocalFileStorageService.java

│   │       └── GeminiService.java

│   ├── src/main/resources/

│   │   └── application.properties

│   ├── uploads/

│   │   └── test.jpeg

│   ├── Dockerfile

│   └── pom.xml

│

├── frontend/                         # React alkalmazás

│   ├── src/

│   │   ├── api/

│   │   │   ├── axiosClient.js

│   │   │   └── photoApi.js

│   │   ├── components/

│   │   │   ├── PhotoCard.jsx

│   │   │   ├── PhotoGallery.jsx

│   │   │   ├── PhotoDetailModal.jsx

│   │   │   ├── PhotoEditModal.jsx

│   │   │   ├── PhotoUploadForm.jsx

│   │   │   ├── DeleteConfirmModal.jsx

│   │   │   └── SearchBar.jsx

│   │   ├── hooks/

│   │   │   ├── usePhotos.js

│   │   │   └── useDebounce.js

│   │   ├── App.jsx

│   │   ├── main.jsx

│   │   └── index.css

│   ├── nginx.conf

│   ├── Dockerfile

│   ├── .dockerignore

│   ├── package.json

│   ├── vite.config.js

│   └── eslint.config.js

│

├── docker-compose.yml

├── .env                              # GEMINI\_API\_KEY (gitignore)

├── .env.example

├── .gitignore

├── PARANCSOK.md

├── README.md

└── PROJEKT-ALLAPOT.md (ez a fájl)

```



\---



\## 4. Backend fájlok tartalma



\### `pom.xml` – fő függőségek



```xml

<parent>

&#x20;   <groupId>org.springframework.boot</groupId>

&#x20;   <artifactId>spring-boot-starter-parent</artifactId>

&#x20;   <version>4.1.1</version>

</parent>



<properties>

&#x20;   <java.version>21</java.version>

&#x20;   <start-class>com.dancsopeter.photoalbum.PhotoAlbumBackendApplication</start-class>

</properties>



<dependencies>

&#x20;   <dependency>spring-boot-starter-web</dependency>

&#x20;   <dependency>spring-boot-starter-data-jpa</dependency>

&#x20;   <dependency>spring-boot-starter-validation</dependency>

&#x20;   <dependency>org.postgresql:postgresql (runtime)</dependency>

&#x20;   <dependency>org.springdoc:springdoc-openapi-starter-webmvc-ui:2.8.5</dependency>

&#x20;   <dependency>com.google.genai:google-genai:1.x</dependency>

&#x20;   <dependency>me.paulschwarz:spring-dotenv:4.0.0</dependency>

&#x20;   <dependency>spring-boot-starter-test (test)</dependency>

</dependencies>

```



\### `application.properties`



```properties

spring.application.name=photo-album-backend



\# Adatbázis

spring.datasource.url=jdbc:postgresql://localhost:5432/photoalbum

spring.datasource.username=photoalbum

spring.datasource.password=photoalbum



\# JPA

spring.jpa.hibernate.ddl-auto=update

spring.jpa.show-sql=true

spring.jpa.properties.hibernate.format\_sql=true



\# Fájlfeltöltés

spring.servlet.multipart.max-file-size=10MB

spring.servlet.multipart.max-request-size=10MB

app.upload.dir=uploads



\# Gemini

gemini.api.key=${GEMINI\_API\_KEY:}

gemini.api.model=gemini-3.5-flash-lite

app.gemini.test-on-startup=false



\# Swagger

springdoc.swagger-ui.path=/swagger-ui.html

springdoc.api-docs.path=/v3/api-docs



\# Hibakezelés

server.error.include-message=always

server.error.include-binding-errors=always

```



\### `PhotoAlbumBackendApplication.java`



```java

@SpringBootApplication

public class PhotoAlbumBackendApplication {

&#x20;   public static void main(String\[] args) {

&#x20;       SpringApplication.run(PhotoAlbumBackendApplication.class, args);

&#x20;   }



&#x20;   @Bean

&#x20;   CommandLineRunner demo(

&#x20;           PhotoService photoService,

&#x20;           GeminiService geminiService,

&#x20;           @Value("${app.gemini.test-on-startup:false}") boolean geminiTestEnabled) {

&#x20;       return args -> {

&#x20;           // Csak üres DB esetén szúr be seed adatokat

&#x20;           if (photoService.findAll().isEmpty()) {

&#x20;               // 3 seed fotó: balaton.jpg (1999), almafa.jpg (2023), karacsony.jpg (1999)

&#x20;               // (ezek DB rekordok, de a fájlok NEM léteznek a lemezen)

&#x20;           }

&#x20;           // Gemini teszt, ha app.gemini.test-on-startup=true

&#x20;       };

&#x20;   }

}

```



\### `Photo.java` (entity)



```java

@Entity

@Table(name = "photo")

public class Photo {

&#x20;   @Id @GeneratedValue(strategy = GenerationType.IDENTITY)

&#x20;   private Long id;

&#x20;   

&#x20;   @Column(nullable = false)

&#x20;   private Integer year;

&#x20;   

&#x20;   @Column(length = 1000)

&#x20;   private String description;

&#x20;   

&#x20;   @Column(nullable = false)

&#x20;   private String filename;              // UUID + kiterjesztés

&#x20;   

&#x20;   @Column(nullable = true)

&#x20;   private String originalFilename;      // eredeti feltöltött név

&#x20;   

&#x20;   @Column(nullable = false)

&#x20;   private LocalDateTime uploadedAt;

&#x20;   

&#x20;   // getterek, setterek (kézzel, Lombok nélkül)

}

```



\### `PhotoRepository.java`



```java

@Repository

public interface PhotoRepository extends JpaRepository<Photo, Long> {

&#x20;   List<Photo> findByYear(Integer year);

&#x20;   List<Photo> findByDescriptionContainingIgnoreCase(String keyword);

&#x20;   

&#x20;   @Query("""

&#x20;           SELECT p FROM Photo p

&#x20;           WHERE CAST(p.year AS String) LIKE :pattern

&#x20;              OR LOWER(p.description) LIKE LOWER(:pattern)

&#x20;           ORDER BY p.uploadedAt DESC

&#x20;           """)

&#x20;   List<Photo> searchByYearOrDescription(@Param("pattern") String pattern);

}

```



\### `PhotoService.java` – metódusok



```java

@Service

public class PhotoService {

&#x20;   private final PhotoRepository photoRepository;

&#x20;   private final PhotoStorageService storageService;

&#x20;   private final GeminiService geminiService;

&#x20;   

&#x20;   // Konstruktor injection (NINCS @Autowired)

&#x20;   

&#x20;   List<Photo> findAll()

&#x20;   Optional<Photo> findById(Long id)

&#x20;   List<Photo> search(String keyword)          // % hozzáfűzés itt

&#x20;   Photo save(Photo photo)                     // uploadedAt beállítás

&#x20;   void deleteById(Long id)

&#x20;   void deleteAll()

&#x20;   

&#x20;   @Transactional Photo uploadPhoto(MultipartFile, Integer, String)

&#x20;   Resource loadImage(Long id)

&#x20;   @Transactional void deletePhoto(Long id)

&#x20;   @Transactional Photo updatePhoto(Long id, Integer, String)

&#x20;   String describeImage(MultipartFile file)

}

```



\### `PhotoStorageService.java` (interface)



```java

public interface PhotoStorageService {

&#x20;   String save(MultipartFile file);

&#x20;   Resource load(String storedFilename);

&#x20;   void delete(String storedFilename);

&#x20;   boolean exists(String storedFilename);

}

```



\### `LocalFileStorageService.java`



Implementálja a `PhotoStorageService`-t. `@Value("${app.upload.dir}")` konstruktor injektálással. Path traversal védelem (`startsWith(rootLocation)`). `StorageException`-t dob minden hibára.



\### `GeminiService.java`



```java

@Service

public class GeminiService {

&#x20;   private final Client client;   // google-genai

&#x20;   private final String model;

&#x20;   

&#x20;   public GeminiService(@Value("${gemini.api.key}") String apiKey,

&#x20;                        @Value("${gemini.api.model}") String model) {

&#x20;       this.client = Client.builder().apiKey(apiKey).build();

&#x20;       this.model = model;

&#x20;   }

&#x20;   

&#x20;   public String describeImage(byte\[] imageBytes, String mimeType) {

&#x20;       String prompt = "Kérlek, írd le részletesen, mi látható ezen a képen. " +

&#x20;                       "Egy rövid, 1-3 mondatos leírást adj, magyar nyelven. " +

&#x20;                       "Csak a leírást add vissza, semmi mást.";

&#x20;       Content content = Content.fromParts(

&#x20;           Part.fromText(prompt),

&#x20;           Part.fromBytes(imageBytes, mimeType)

&#x20;       );

&#x20;       ThinkingConfig thinkingConfig = ThinkingConfig.builder()

&#x20;               .thinkingLevel(ThinkingLevel.Known.LOW)   // FONTOS: Known.LOW

&#x20;               .build();

&#x20;       GenerateContentConfig config = GenerateContentConfig.builder()

&#x20;               .thinkingConfig(thinkingConfig)

&#x20;               .build();

&#x20;       GenerateContentResponse response = client.models.generateContent(model, content, config);

&#x20;       return response.text();

&#x20;   }

}

```



\### `PhotoController.java` – végpontok



```java

@RestController

@RequestMapping("/api/photos")

public class PhotoController {

&#x20;   private final PhotoService photoService;   // konstruktor injection



&#x20;   @GetMapping

&#x20;   List<Photo> getAll()



&#x20;   @GetMapping("/{id}")

&#x20;   ResponseEntity<Photo> getById(@PathVariable Long id)



&#x20;   @GetMapping("/{id}/image")

&#x20;   ResponseEntity<Resource> getImage(@PathVariable Long id)



&#x20;   @GetMapping("/search")

&#x20;   List<Photo> search(@RequestParam(required = false) String keyword)



&#x20;   @PostMapping(consumes = MULTIPART\_FORM\_DATA)

&#x20;   ResponseEntity<Photo> upload(@Valid @ModelAttribute PhotoUploadRequest request)

&#x20;   // request: { MultipartFile file; Integer year; String description }



&#x20;   @PostMapping(value = "/describe", consumes = MULTIPART\_FORM\_DATA)

&#x20;   ResponseEntity<PhotoDescriptionResponse> describe(@RequestParam("file") MultipartFile file)



&#x20;   @PatchMapping(value = "/{id}", consumes = APPLICATION\_JSON)

&#x20;   ResponseEntity<Photo> update(@PathVariable Long id, @Valid @RequestBody PhotoUpdateRequest request)



&#x20;   @DeleteMapping("/{id}")

&#x20;   ResponseEntity<Void> delete(@PathVariable Long id)

}

```



\### DTO-k



```java

// PhotoUploadRequest

public record PhotoUploadRequest(

&#x20;   @NotNull MultipartFile file,

&#x20;   @NotNull @Min(1000) @Max(9999) Integer year,

&#x20;   @Size(max = 1000) String description

) {}



// PhotoUpdateRequest

public record PhotoUpdateRequest(

&#x20;   @Min(1000) @Max(9999) Integer year,

&#x20;   @Size(max = 1000) String description

) {}



// PhotoDescriptionResponse

public record PhotoDescriptionResponse(String description) {}



// ErrorResponse

public record ErrorResponse(

&#x20;   LocalDateTime timestamp,

&#x20;   int status,

&#x20;   String error,

&#x20;   String message,

&#x20;   String path

) {}

```



\### `CorsConfig.java`



```java

@Configuration

public class CorsConfig implements WebMvcConfigurer {

&#x20;   @Override

&#x20;   public void addCorsMappings(CorsRegistry registry) {

&#x20;       registry.addMapping("/api/\*\*")

&#x20;               .allowedOrigins(

&#x20;                   "http://localhost:5173",   // Vite dev

&#x20;                   "http://localhost:4200",   // Angular (terv)

&#x20;                   "http://localhost:3000"    // Docker frontend

&#x20;               )

&#x20;               .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")

&#x20;               .allowedHeaders("\*")

&#x20;               .allowCredentials(true)

&#x20;               .maxAge(3600);

&#x20;   }

}

```



\### `OpenApiConfig.java`



```java

@Configuration

public class OpenApiConfig {

&#x20;   @Bean

&#x20;   public OpenAPI photoAlbumOpenAPI() {

&#x20;       return new OpenAPI().info(new Info()

&#x20;               .title("Photo Album API")

&#x20;               .description("REST API for managing a photo album with AI-powered descriptions")

&#x20;               .version("0.0.1-SNAPSHOT"));

&#x20;   }

}

```



\### `GlobalExceptionHandler.java`



```java

@RestControllerAdvice

public class GlobalExceptionHandler {

&#x20;   @ExceptionHandler(PhotoNotFoundException.class)        // 404

&#x20;   @ExceptionHandler(StorageException.class)              // 500

&#x20;   @ExceptionHandler(IllegalArgumentException.class)      // 400

&#x20;   @ExceptionHandler(MethodArgumentNotValidException.class)  // 400 (DTO validation)

&#x20;   @ExceptionHandler(ConstraintViolationException.class)  // 400 (param validation)

&#x20;   @ExceptionHandler(Exception.class)                     // 500 (catch-all)

}

```



\### Saját kivételek



```java

public class PhotoNotFoundException extends RuntimeException {

&#x20;   public PhotoNotFoundException(Long id) { super("Fotó nem található: id=" + id); }

}



public class StorageException extends RuntimeException {

&#x20;   public StorageException(String message) { super(message); }

&#x20;   public StorageException(String message, Throwable cause) { super(message, cause); }

}

```



\### `backend/Dockerfile`



```dockerfile

\# --- 1. szakasz: Build ---

FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

COPY pom.xml .

RUN mvn dependency:go-offline -B

COPY src ./src

RUN mvn clean package -DskipTests



\# --- 2. szakasz: Runtime ---

FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY --from=build /app/target/\*.jar app.jar

RUN mkdir -p /app/uploads

EXPOSE 8080

ENTRYPOINT \["java", "-jar", "app.jar"]

```



\---



\## 5. Frontend fájlok tartalma



\### `package.json` – fő függőségek



```json

{

&#x20; "dependencies": {

&#x20;   "axios": "^1.x.x",

&#x20;   "react": "^19.x.x",

&#x20;   "react-dom": "^19.x.x"

&#x20; },

&#x20; "devDependencies": {

&#x20;   "@vitejs/plugin-react": "...",

&#x20;   "vite": "^8.x.x",

&#x20;   "eslint": "...",

&#x20;   "prettier": "..."

&#x20; },

&#x20; "scripts": {

&#x20;   "dev": "vite",

&#x20;   "build": "vite build",

&#x20;   "preview": "vite preview",

&#x20;   "lint": "eslint ."

&#x20; }

}

```



\### `vite.config.js`



```javascript

export default defineConfig({

&#x20; plugins: \[react()],

&#x20; server: {

&#x20;   proxy: {

&#x20;     '/api': {

&#x20;       target: 'http://localhost:8080',

&#x20;       changeOrigin: true,

&#x20;     },

&#x20;   },

&#x20; },

})

```



\### `src/api/axiosClient.js`



```javascript

import axios from 'axios'



const axiosClient = axios.create({

&#x20; baseURL: '/api',

&#x20; timeout: 30000,

&#x20; headers: { 'Content-Type': 'application/json' },

})



export default axiosClient

```



\### `src/api/photoApi.js`



```javascript

import axiosClient from './axiosClient'



export const photoApi = {

&#x20; getAll: async () => (await axiosClient.get('/photos')).data,

&#x20; getById: async (id) => (await axiosClient.get(`/photos/${id}`)).data,

&#x20; search: async (keyword) => (await axiosClient.get('/photos/search', { params: { keyword } })).data,

&#x20; 

&#x20; upload: async (file, year, description) => {

&#x20;   const formData = new FormData()

&#x20;   formData.append('file', file)

&#x20;   formData.append('year', year)

&#x20;   if (description) formData.append('description', description)

&#x20;   return (await axiosClient.post('/photos', formData, {

&#x20;     headers: { 'Content-Type': 'multipart/form-data' },

&#x20;   })).data

&#x20; },

&#x20; 

&#x20; describe: async (file) => {

&#x20;   const formData = new FormData()

&#x20;   formData.append('file', file)

&#x20;   return (await axiosClient.post('/photos/describe', formData, {

&#x20;     headers: { 'Content-Type': 'multipart/form-data' },

&#x20;     timeout: 180000,

&#x20;   })).data

&#x20; },

&#x20; 

&#x20; update: async (id, year, description) => 

&#x20;   (await axiosClient.patch(`/photos/${id}`, { year, description })).data,

&#x20; 

&#x20; delete: async (id) => {

&#x20;   await axiosClient.delete(`/photos/${id}`)

&#x20; },

&#x20; 

&#x20; getImageUrl: (id) => `/api/photos/${id}/image`,

}

```



\### `src/hooks/usePhotos.js`



```javascript

import { useEffect, useState } from 'react'

import { photoApi } from '../api/photoApi'



export function usePhotos(searchTerm) {

&#x20; const \[photos, setPhotos] = useState(\[])

&#x20; const \[loading, setLoading] = useState(true)

&#x20; const \[error, setError] = useState(null)

&#x20; const \[refreshKey, setRefreshKey] = useState(0)



&#x20; useEffect(() => {

&#x20;   let cancelled = false

&#x20;   const fetchPhotos = async () => {

&#x20;     setLoading(true)

&#x20;     setError(null)

&#x20;     try {

&#x20;       const data = searchTerm ? await photoApi.search(searchTerm) : await photoApi.getAll()

&#x20;       if (!cancelled) {

&#x20;         setPhotos(data)

&#x20;         setLoading(false)

&#x20;       }

&#x20;     } catch (err) {

&#x20;       if (!cancelled) {

&#x20;         setError(err.message)

&#x20;         setLoading(false)

&#x20;       }

&#x20;     }

&#x20;   }

&#x20;   fetchPhotos()

&#x20;   return () => { cancelled = true }

&#x20; }, \[searchTerm, refreshKey])



&#x20; const refresh = () => setRefreshKey((k) => k + 1)

&#x20; return { photos, loading, error, refresh }

}

```



\### `src/hooks/useDebounce.js`



```javascript

import { useEffect, useState } from 'react'



export function useDebounce(value, delay = 300) {

&#x20; const \[debounced, setDebounced] = useState(value)

&#x20; useEffect(() => {

&#x20;   const timer = setTimeout(() => setDebounced(value), delay)

&#x20;   return () => clearTimeout(timer)

&#x20; }, \[value, delay])

&#x20; return debounced

}

```



\### `src/App.jsx` – state és handlerek



```javascript

function App() {

&#x20; // State-ek

&#x20; const \[searchTerm, setSearchTerm] = useState('')

&#x20; const \[showUploadForm, setShowUploadForm] = useState(false)

&#x20; const \[deleteTarget, setDeleteTarget] = useState(null)

&#x20; const \[deleting, setDeleting] = useState(false)

&#x20; const \[selectedIndex, setSelectedIndex] = useState(null)   // detail modal

&#x20; const \[editTarget, setEditTarget] = useState(null)          // edit modal

&#x20; const \[editing, setEditing] = useState(false)



&#x20; const debouncedSearchTerm = useDebounce(searchTerm, 300)

&#x20; const { photos, loading, error, refresh } = usePhotos(debouncedSearchTerm)



&#x20; // Handlerek

&#x20; handleUploadSuccess()   // bezárja a formot, refresh()

&#x20; handleDeleteConfirm()   // DELETE, refresh()

&#x20; handleEditSave(year, description)  // PATCH, refresh()



&#x20; // JSX: header, main (form + search + gallery), 3 modal

&#x20; // - DeleteConfirmModal

&#x20; // - PhotoEditModal (feltételes: editTarget \&\& ...)

&#x20; // - PhotoDetailModal (photos, currentIndex, onNavigate, onClose, onEdit)

}

```



\### Komponensek – rövid összefoglaló



\*\*`PhotoCard.jsx`\*\* – Egy fotó kártyája.

\- Props: `photo`, `onDelete`, `onSelect`

\- Kattintható (a teljes kártya), de a törlés gombon `e.stopPropagation()`

\- Hover-re megjelenő törlés gomb



\*\*`PhotoGallery.jsx`\*\* – A galéria rács.

\- Props: `photos`, `onDelete`, `onSelect`

\- `map((photo, index) => ...)` – átadja az indexet `onSelect(() => onSelect(index))` formában

\- Üres esetén üzenet



\*\*`PhotoDetailModal.jsx`\*\* – Nagy kép modal.

\- Props: `photos`, `currentIndex`, `onNavigate`, `onClose`, `onEdit`

\- Billentyűzet kezelés (`useEffect` + `window.addEventListener('keydown')`)

\- ESC = close, ArrowLeft = prev, ArrowRight = next

\- Wrap-around modulo-val

\- Számláló: `{currentIndex + 1} / {photos.length}`

\- Jobb/bal nyilak, ha `hasMultiple`



\*\*`PhotoEditModal.jsx`\*\* – Szerkesztő modal.

\- Props: `photo`, `onSave`, `onCancel`, `saving`

\- `useState(photo.year)`, `useState(photo.description || '')`

\- Validáció: 1000-9999

\- Elevated modal (`modal-backdrop--elevated`, z-index 1100)



\*\*`PhotoUploadForm.jsx`\*\* – Feltöltő űrlap.

\- Props: `onUploadSuccess`

\- State: `file`, `preview`, `year`, `description`, `uploading`, `describing`, `error`

\- `useRef` a fájl inputhoz

\- `URL.createObjectURL` az előnézethez + `URL.revokeObjectURL` cleanup

\- „Leírás AI-val" gomb → `/api/photos/describe`

\- Feltöltés → `onUploadSuccess()`



\*\*`DeleteConfirmModal.jsx`\*\* – Törlés megerősítő.

\- Props: `photo`, `onConfirm`, `onCancel`, `deleting`

\- `if (!photo) return null`

\- `onClick={onCancel}` a backdropen, `e.stopPropagation()` a modálon



\*\*`SearchBar.jsx`\*\* – Keresősáv.

\- Props: `value`, `onChange`, `placeholder`

\- Kontrollált input

\- SVG magnifying glass ikon (inline)



\### `src/index.css`



Tartalmazza az összes stílust:

\- Reset, body

\- App header, main

\- Search bar (magnifying glass ikon, focus state)

\- Photo gallery (CSS Grid: `repeat(auto-fill, minmax(260px, 1fr))`)

\- Photo card (hover animáció, delete gomb hover-re jelenik meg)

\- Modal (backdrop, elevated, fadeIn és slideUp animációk)

\- Photo detail modal (counter, nav gombok, dark image background)

\- Edit modal

\- Upload form (inputok, gombok, preview)



\### `frontend/Dockerfile`



```dockerfile

FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build



FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD \["nginx", "-g", "daemon off;"]

```



\### `frontend/nginx.conf`



```nginx

server {

&#x20;   listen 80;

&#x20;   server\_name localhost;

&#x20;   root /usr/share/nginx/html;

&#x20;   index index.html;



&#x20;   location /api/ {

&#x20;       proxy\_pass http://backend:8080/api/;

&#x20;       proxy\_set\_header Host $host;

&#x20;       proxy\_set\_header X-Real-IP $remote\_addr;

&#x20;       proxy\_set\_header X-Forwarded-For $proxy\_add\_x\_forwarded\_for;

&#x20;       proxy\_set\_header X-Forwarded-Proto $scheme;

&#x20;       proxy\_read\_timeout 300s;

&#x20;       proxy\_send\_timeout 300s;

&#x20;       client\_max\_body\_size 10M;

&#x20;   }



&#x20;   location / {

&#x20;       try\_files $uri $uri/ /index.html;

&#x20;   }

}

```



\### `frontend/.dockerignore`



```

node\_modules

dist

.git

.gitignore

.vscode

\*.log

```



\---



\## 6. Docker Compose



\### `docker-compose.yml`



```yaml

services:

&#x20; postgres:

&#x20;   image: postgres:16-alpine

&#x20;   container\_name: photo-album-postgres

&#x20;   environment:

&#x20;     POSTGRES\_DB: photoalbum

&#x20;     POSTGRES\_USER: photoalbum

&#x20;     POSTGRES\_PASSWORD: photoalbum

&#x20;   ports:

&#x20;     - "5432:5432"

&#x20;   volumes:

&#x20;     - postgres\_data:/var/lib/postgresql/data

&#x20;   healthcheck:

&#x20;     test: \["CMD-SHELL", "pg\_isready -U photoalbum -d photoalbum"]

&#x20;     interval: 5s

&#x20;     timeout: 5s

&#x20;     retries: 10



&#x20; backend:

&#x20;   build:

&#x20;     context: ./backend

&#x20;     dockerfile: Dockerfile

&#x20;   container\_name: photo-album-backend

&#x20;   depends\_on:

&#x20;     postgres:

&#x20;       condition: service\_healthy

&#x20;   environment:

&#x20;     SPRING\_DATASOURCE\_URL: jdbc:postgresql://postgres:5432/photoalbum

&#x20;     SPRING\_DATASOURCE\_USERNAME: photoalbum

&#x20;     SPRING\_DATASOURCE\_PASSWORD: photoalbum

&#x20;     GEMINI\_API\_KEY: ${GEMINI\_API\_KEY}

&#x20;   ports:

&#x20;     - "8080:8080"

&#x20;   volumes:

&#x20;     - ./backend/uploads:/app/uploads



&#x20; frontend:

&#x20;   build:

&#x20;     context: ./frontend

&#x20;     dockerfile: Dockerfile

&#x20;   container\_name: photo-album-frontend

&#x20;   depends\_on:

&#x20;     - backend

&#x20;   ports:

&#x20;     - "3000:80"



volumes:

&#x20; postgres\_data:

```



\### `.env` (gitignore-olt)



```

GEMINI\_API\_KEY=AIzaSy...

```



\### `.env.example` (git-ben)



```

GEMINI\_API\_KEY=your-gemini-api-key-here

```



\---



\## 7. API végpontok összefoglaló



| Metódus | Útvonal | Mit csinál |

|---|---|---|

| `GET` | `/api/photos` | Összes fotó |

| `GET` | `/api/photos/{id}` | Egy fotó metaadat |

| `GET` | `/api/photos/{id}/image` | A kép bináris tartalma |

| `GET` | `/api/photos/search?keyword=...` | Keresés év + leírás |

| `POST` | `/api/photos` | Új fotó feltöltése (multipart) |

| `POST` | `/api/photos/describe` | AI leírás generálás (multipart, stateless) |

| `PATCH` | `/api/photos/{id}` | Év/leírás módosítás (JSON) |

| `DELETE` | `/api/photos/{id}` | Fotó törlése (DB + fájl) |



\---



\## 8. Fő döntések és konvenciók



\### Backend

\- \*\*Lombok NEM használunk\*\* – a fejlesztő korábban inkompatibilitási problémákat tapasztalt. Getterek/setterek kézzel (IDE-vel generálva).

\- \*\*Konstruktor injection\*\* mindenhol, `@Autowired` nélkül (egy konstruktor).

\- \*\*DTO-k\*\* mindenhol: `PhotoUploadRequest`, `PhotoUpdateRequest`, `PhotoDescriptionResponse`, `ErrorResponse`. Entitást \*\*soha\*\* nem adunk ki közvetlenül.

\- \*\*`@Transactional`\*\* a `PhotoService` metódusain: `uploadPhoto`, `deletePhoto`, `updatePhoto`.

\- \*\*Custom exception-ök\*\*: `PhotoNotFoundException` (404), `StorageException` (500).

\- \*\*`GlobalExceptionHandler`\*\* kezeli az összes kivételt, egységes `ErrorResponse`-szal.

\- \*\*`PhotoStorageService`\*\* interfész + `LocalFileStorageService` implementáció. Cél: S3-ra később átállni.

\- \*\*Path traversal védelem\*\* a fájlműveleteknél: `filePath.startsWith(rootLocation)`.

\- \*\*UUID fájlnevek\*\* – a feltöltött fájlok neve UUID + kiterjesztés, az eredetit az `originalFilename` tárolja.

\- \*\*`@GeneratedValue(strategy = IDENTITY)`\*\* – PostgreSQL auto-increment.

\- \*\*`ddl-auto=update`\*\* – fejlesztéshez, production-ben Flyway-re váltunk.



\### Frontend

\- \*\*Funkcionális komponensek\*\* + hookok (nincs class).

\- \*\*Custom hookok\*\*: `usePhotos`, `useDebounce` – a logika szétválasztva.

\- \*\*State lifting\*\* – a közös state a szülőben (`App`).

\- \*\*Callback prop-ok\*\* – a gyerek jelzi a szándékot a szülőnek.

\- \*\*`e.stopPropagation()`\*\* – egymásba ágyazott kattintható elemeknél.

\- \*\*Feltételes renderelés\*\* – `{condition \&\& <Component />}` és `if (!x) return null`.

\- \*\*`\&\&` mount\*\* – `{editTarget \&\& <PhotoEditModal ... />}`, hogy a state újrainicializálódjon.

\- \*\*Debouncing\*\* 300ms – a keresőben.

\- \*\*Relatív API URL\*\* (`/api/...`) – Vite proxy (dev) és nginx proxy (prod).

\- \*\*`useRef`\*\* – a fájl input törléséhez (nem kontrollált input).

\- \*\*`URL.createObjectURL` + `URL.revokeObjectURL`\*\* – előnézet + memória felszabadítás.

\- \*\*`cancelled` flag\*\* – race condition elleni védelem az async fetch-nél.

\- \*\*Modal a modal fölött\*\* – eltérő z-index (`modal-backdrop--elevated` 1100).



\### Git konvenciók

\- \*\*Commit üzenetek angolul\*\*, imperatív módban („Add", „Fix", „Update" – nem „Added").

\- \*\*Részletes commit üzenet\*\* – cím + `-m "Details: ..."` lista a részletekről.

\- \*\*PowerShell here-string\*\* a hosszú üzenetekhez: `git commit -m @"..."@`.

\- \*\*Gitignore\*\*: `target/`, `node\_modules/`, `uploads/\*` (kivéve `test.jpeg`), `.env`, `dist/`.



\### Nyelv

\- \*\*A felhasználó magyarul kommunikál\*\*, a kód angolul.

\- \*\*A tanulási stílus\*\*: minden újat részletesen elmagyarázunk, mielőtt továbbmegyünk. A felhasználó sokat kérdez, és ezt értékeljük.



\---



\## 9. Fejlesztési munkafolyamat



\### Napi rutin – teljes stack Dockerben



```powershell

cd D:\\Prog\\photo-album

docker compose up -d --build

```



\- Frontend: `http://localhost:3000`

\- Backend API: `http://localhost:8080/api/photos`

\- Swagger: `http://localhost:8080/swagger-ui.html`



\### Ha csak a backend változott



```powershell

docker compose up -d --build backend

```



\### Ha csak a frontend változott



```powershell

docker compose up -d --build frontend

```



\### Docker parancsok, amiket használunk



\- `docker compose up -d --build` – build + indítás

\- `docker compose down` – leállítás (volume-ok megmaradnak)

\- `docker compose restart <service>` – újraindítás build nélkül

\- `docker compose logs <service> --tail 50` – napló

\- `docker exec -it photo-album-postgres psql -U photoalbum -d photoalbum` – DB-be belépés

\- `docker exec photo-album-frontend nginx -t` – nginx config teszt



\---



\## 10. Ismert problémák és korlátok



1\. \*\*A seed fotók (`balaton.jpg`, `almafa.jpg`, `karacsony.jpg`) fájljai nem léteznek a lemezen\*\* – ezért a galériában ezek a képek 500-as hibát adnak. A `CommandLineRunner` csak DB rekordokat szúr be, fájlokat nem.

2\. \*\*Nincs kép placeholder\*\* – ha egy kép nem töltődik be, üresen marad a hely.

3\. \*\*Nincs SSE real-time frissítés\*\* – a frontend nem frissül automatikusan, ha a DB-t közvetlenül módosítják.

4\. \*\*Nincs JWT authentication\*\* – mindenki hozzáfér mindenhez.

5\. \*\*Nincs Flyway\*\* – `ddl-auto=update` (fejlesztéshez elég, production-ben nem).

6\. \*\*Nincsenek tesztek\*\* – sem unit, sem integrációs.

7\. \*\*Nincs CI/CD\*\* – GitHub Actions nincs beállítva.

8\. \*\*Nincs screenshot a README-ben\*\* – szöveges leírás van csak.

9\. \*\*A NetBeans konzol nem jeleníti meg az ékezetes karaktereket\*\* – kozmetikai probléma, a kód működik.

10\. \*\*A felhasználó Node.js verziója `v24.21.0`\*\*, az npm verziója `11.19.0`.



\---



\## 11. Mi van hátra (roadmap)



\### Prioritásos

\- \[ ] \*\*Screenshotok a README-hez\*\* (4-5 kép: galéria, feltöltés, detail modal, edit modal, törlés modal)

\- \[ ] \*\*Kép placeholder / onError kezelés\*\* a frontenden

\- \[ ] \*\*Seed fotók problémájának megoldása\*\* (vagy törölni a seed adatokat, vagy valódi fájlokat adni)



\### Opcionális feature-ök

\- \[ ] \*\*SSE real-time frissítés\*\* + PostgreSQL LISTEN/NOTIFY

\- \[ ] \*\*JWT authentication\*\* (single-user vagy multi-user)

\- \[ ] \*\*Flyway\*\* adatbázis migrációk

\- \[ ] \*\*Tesztek\*\* (JUnit, Testcontainers, React Testing Library)

\- \[ ] \*\*CI/CD\*\* GitHub Actions-szel

\- \[ ] \*\*S3 storage\*\* implementáció



\---



\## 12. Fontos környezeti információk



| Elem | Érték |

|---|---|

| \*\*Operációs rendszer\*\* | Windows 11 |

| \*\*Java\*\* | JDK 21 (Eclipse Temurin) |

| \*\*Node.js\*\* | v24.21.0 |

| \*\*npm\*\* | 11.19.0 |

| \*\*IDE backend\*\* | NetBeans 31 |

| \*\*IDE frontend\*\* | VS Code |

| \*\*Shell\*\* | PowerShell (cmd helyett – here-string miatt) |

| \*\*WSL2\*\* | Telepítve (Docker-hez) |

| \*\*Docker Desktop\*\* | Telepítve |



\### Elérési utak



| Elem | Érték |

|---|---|

| \*\*Projekt gyökér\*\* | `D:\\Prog\\photo-album` |

| \*\*Backend\*\* | `D:\\Prog\\photo-album\\backend` |

| \*\*Frontend\*\* | `D:\\Prog\\photo-album\\frontend` |

| \*\*GitHub repo\*\* | `https://github.com/pogessor/photo-album` (privát) |



\### Portok



| Szolgáltatás | Port |

|---|---|

| Frontend (Docker, nginx) | 3000 |

| Frontend (Vite dev) | 5173 |

| Backend (Spring Boot) | 8080 |

| PostgreSQL | 5432 |



\---



\## 13. Hogyan kommunikálj a felhasználóval (fontos az új beszélgetéshez)



\- \*\*Nyelv:\*\* magyar.

\- \*\*Stílus:\*\* részletes, türelmes, mindent elmagyarázó. A felhasználó \*\*tanulni akar\*\*, nem csak másolni.

\- \*\*A felhasználó sokat kérdez\*\* – ez \*\*értékes\*\*, nem zavaró.

\- \*\*Lassan haladunk\*\*, egy lépés = egy jól körülhatárolt feladat.

\- \*\*Mindig magyarázd el a „miért"-et\*\*, ne csak a „hogyan"-t.

\- \*\*Ha valami nem világos a felhasználónak\*\*, állj meg és magyarázd el mélyebben.

\- \*\*A commit üzeneteket\*\* a felhasználó gyakran kéri szó szerint.

\- \*\*A felhasználó PowerShell-t használ\*\* (nem cmd-t), és a hosszú commit üzenetekhez here-string kell.

\- \*\*Ne használj Lombok-ot\*\* – a felhasználónak korábban inkompatibilitási problémái voltak.

\- \*\*A NetBeans konzol kódolási problémákkal küzd\*\* – ne foglalkozz vele, kozmetikai.



\---



\## 14. Jelenlegi git állapot



A legutóbbi commitok:

\- `Add frontend to Docker Compose and update project documentation`

\- `Make CommandLineRunner seed data conditional on empty database`

\- `Add photo edit functionality with elevated modal`

\- `Add keyboard navigation and counter to photo detail modal`

\- `Add photo detail modal with click-to-view`

\- `Add delete functionality with confirmation modal`

\- `Add debounced search bar to frontend`

\- `Add photo upload form with AI description and blob cleanup`

\- `Add axios, API client and folder structure`

\- `Initialize React frontend with Vite`

\- `Add Swagger UI and comprehensive README documentation`

\- `Add CORS configuration for React and Angular frontends`

\- `Add Gemini API integration with optional startup test`

\- `Add multi-stage Dockerfile and full-stack docker-compose`

\- `Implement file upload, image serving and delete endpoints`

\- `Add stateless image description endpoint using Gemini API`

\- `Add PATCH endpoint for updating photo metadata`

\- `Add global exception handling with unified error response`

\- `Add bean validation and unify DTO-based request handling`

\- ... (korábbi: environment setup, entity, repository, service, controller)



\---



\## 15. Amit a felhasználó legutóbb kérdezett / amin dolgoztunk



\- \*\*Legutóbbi téma:\*\* a `CommandLineRunner` átalakítása, hogy csak üres DB esetén szúrjon be seed adatokat (így a feltöltött fotók megmaradnak újraindítás után).

\- \*\*Következő lehetséges lépések:\*\* screenshotok a README-hez, kép placeholder, SSE, JWT.



\---



\*\*Ez a dokumentum a projekt jelenlegi állapotát írja le. Ha bármi változik, frissítsd!\*\*

