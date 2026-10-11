# Parancsok gyűjteménye

Ez a fájl a projekt során használt leggyakoribb parancsokat gyűjti össze rövid magyarázattal.
Célja, hogy gyors referenciaként szolgáljon a mindennapi munkához.

## Tartalomjegyzék

- [1. Környezet ellenőrzése](#1-környezet-ellenőrzése)
- [2. Git – verziókezelés](#2-git--verziókezelés)
- [3. Docker – konténerek](#3-docker--konténerek)
- [4. Maven – build tool](#4-maven--build-tool)
- [5. npm – frontend build tool](#5-npm--frontend-build-tool)
- [6. NetBeans-specifikus műveletek](#6-netbeans-specifikus-műveletek)
- [7. VS Code-specifikus műveletek](#7-vs-code-specifikus-műveletek)
- [8. Projektstruktúra navigálás](#8-projektstruktúra-navigálás)
- [9. Napi rutin – munka kezdése](#9-napi-rutin--munka-kezdése)
- [10. Napi rutin – munka befejezése](#10-napi-rutin--munka-befejezése)
- [11. Teljes tesztelés](#11-teljes-tesztelés)
- [12. Hibakeresési gyorssegéd](#12-hibakeresési-gyorssegéd)
- [13. Projekt specifikus információk](#13-projekt-specifikus-információk)

## 1. Környezet ellenőrzése

Ezeket egyszer-egyszer futtatjuk, hogy lássuk, minden telepítve van-e.

| Parancs | Mit csinál | Miért fontos |
|---|---|---|
| `java --version` | Megmutatja a Java verziót | Ellenőrizzük, hogy JDK 21+ van-e |
| `echo %JAVA_HOME%` | Kiírja a JAVA_HOME környezeti változót | A Maven és az eszközök ezt használják |
| `mvn -version` | Maven verzió | Ellenőrizzük, hogy a Maven elérhető |
| `git --version` | Git verzió | Verziókezelés ellenőrzése |
| `wsl --status` | WSL2 állapot | A Docker ezt használja Windows-on |
| `docker --version` | Docker verzió | Konténerek futtatásához |
| `docker compose version` | Docker Compose verzió | Több konténeres projekt |
| `docker run hello-world` | Teszt konténer futtatása | Első ellenőrzés, hogy a Docker működik |
| `chcp 65001` | Konzol kódlaptábla UTF-8-ra | Ékezetes karakterek megjelenítése |
| `node --version` | Node.js verzió | Frontend fejlesztéshez |
| `npm --version` | npm (Node Package Manager) verzió | Frontend csomagok kezelése |

## 2. Git – verziókezelés

Ez a **napi rutin** – minden értelmes lépés után futtatjuk.

| Parancs | Mit csinál | Miért fontos |
|---|---|---|
| `git init` | Új git repository inicializálása | Egyszer kell, a projekt elején |
| `git status` | Megmutatja a változásokat | Mindig ezzel kezdünk |
| `git add .` | Az összes változást staging-be teszi | A commit előtt kell |
| `git add <fájl>` | Csak egy konkrét fájlt ad hozzá | Ha nem akarunk mindent commitolni |
| `git add -f <fájl>` | Kényszerített hozzáadás `.gitignore` ellenére | A `test.jpeg` esetén használtuk |
| `git commit -m "..."` | Commit létrehozása üzenettel | Egy logikai egység mentése |
| `git commit -m "cím" -m "leírás"` | Commit cím + részletes leírás | Profibb commit-történet |
| `git commit --amend` | Az utolsó commit módosítása | Ha elrontottuk az üzenetet |
| `git commit --amend -F commit-msg.txt` | Commit üzenet fájlból | Hosszú üzenethez |
| `git log --oneline` | Commitok listája röviden | Múltbeli commitok áttekintése |
| `git log --oneline -3` | Utolsó 3 commit | Gyors ellenőrzés |
| `git diff <fájl>` | Egy fájl változásai | Mit módosítottunk? |
| `git checkout -- <fájl>` | Fájl visszaállítása az utolsó commitra | Változások eldobása |
| `git reset --soft HEAD~1` | Az utolsó commit visszavonása, változások megmaradnak | Újracommitoláshoz |
| `git ls-files \| findstr env` | Követett fájlok szűrése | Ellenőrizzük, hogy a `.env` nincs benne |
| `git remote add origin <url>` | Távoli repo hozzáadása | Egyszer, a GitHub repo csatlakoztatása |
| `git branch -M main` | Branch átnevezése `main`-re | A GitHub ezt használja alapból |
| `git push` | Feltolja a commitokat a GitHubra | Hogy mások lássák |
| `git push -u origin main` | Első push + tracking beállítás | Utána elég csak `git push` |
| `git config --global user.name "Név"` | Git felhasználónév beállítása | Egyszer kell |
| `git config --global user.email "email"` | Git email beállítása | Egyszer kell |
| `git config --global core.editor "notepad"` | Alapértelmezett szerkesztő | `git commit --amend`-hez |
| `git config --global core.autocrlf true` | Sorvég-kezelés | CRLF/LF figyelmeztetések eltüntetése |

## 3. Docker – konténerek

### 3.1 – Konténer életciklus

| Parancs | Mit csinál | Miért fontos |
|---|---|---|
| `docker ps` | Futó konténerek listája | Látod, mi fut éppen |
| `docker ps -a` | Az összes konténer (leállított is) | Debugoláshoz |
| `docker images` | Az összes image listája | Látod, mi van letöltve |
| `docker compose up -d postgres` | Csak a PostgreSQL indítása háttérben | Fejlesztéskor erre van szükség |
| `docker compose up --build` | Újraépít + indít (foreground) | Teljes stack futtatása |
| `docker compose up -d --build` | Ugyanaz, de háttérben | Nem foglalja a terminált |
| `docker compose up --build -d backend` | Csak a backend újraépítése | Ha csak a backend változott |
| `docker compose down` | Konténerek leállítása | Nem törli a volume-okat |
| `docker compose logs <service>` | Egy szolgáltatás naplója | Hibakereséshez |
| `docker compose logs -f <service>` | Élő naplókövetés | Folyamatos figyelés |
| `docker compose logs <service> --tail 50` | Utolsó 50 sor | Gyors ellenőrzés |
| `docker exec -it <konténer> bash` | Belépés a konténerbe | Debugoláshoz |
| `docker exec <konténer> nginx -t` | Nginx konfig tesztelése | Config szintaxis ellenőrzés |
| `docker exec -it photo-album-postgres psql -U photoalbum -d photoalbum` | Belépés a PostgreSQL-be | Adatbázis-műveletekhez |
| `docker system prune -a` | Az összes nem használt erőforrás törlése | Hely felszabadítás |

### 3.2 – PostgreSQL parancsok (a `psql`-en belül)

| Parancs | Mit csinál |
|---|---|
| `\dt` | Táblák listája |
| `\d photo` | A `photo` tábla szerkezete |
| `\l` | Adatbázisok listája |
| `SELECT * FROM photo;` | Az összes fotó listázása |
| `\q` | Kilépés |

## 4. Maven – build tool

| Parancs | Mit csinál | Miért fontos |
|---|---|---|
| `mvnw.cmd clean install` | Töröl + újrafordít + csomagol + telepít | Teljes build, parancssorból |
| `mvnw.cmd spring-boot:run` | Az alkalmazás futtatása | Parancssori indítás |
| `mvnw.cmd test` | Csak a tesztek futtatása | Gyors tesztelés |
| `mvnw.cmd clean` | A `target/` mappa törlése | Tiszta build előtt |
| `mvnw.cmd dependency:tree` | Függőségek fa szerkezete | Konfliktusok felderítése |

**Megjegyzés:** a NetBeans-ben a **Clean and Build** és a **Run** gombok ugyanezeket a parancsokat futtatják a háttérben.

## 5. npm – frontend build tool

| Parancs | Mit csinál | Miért fontos |
|---|---|---|
| `npm install` | Függőségek telepítése + lock fájl frissítése | Új csomag vagy lock szinkron |
| `npm install <csomag>` | Egy csomag telepítése | Pl. `npm install axios` |
| `npm ci` | Tiszta telepítés a lock fájlból | CI/CD, Docker build |
| `npm run dev` | Fejlesztői szerver indítása | Vite dev server (5173) |
| `npm run build` | Production build | `dist/` mappa létrehozása |
| `npm run preview` | A production build előnézete | Build tesztelés |
| `npm run lint` | ESLint futtatása | Kódminőség ellenőrzés |
| `npm outdated` | Elavult csomagok listája | Frissítések keresése |
| `npm update` | Csomagok frissítése | Verziók frissítése |

## 6. NetBeans-specifikus műveletek

| Művelet | Mit csinál |
|---|---|
| **Alt + Insert** | Kód generálás (getter/setter, konstruktor) |
| **Ctrl + Shift + I** | Importok rendezése |
| **F6** | Projekt futtatása |
| **Shift + F6** | Projekt debug módban |
| **Ctrl + S** | Mentés (mindig!) |
| **Ctrl + Shift + F** | Formázás |

## 7. VS Code-specifikus műveletek

| Művelet | Mit csinál |
|---|---|
| **Ctrl + P** | Fájl gyors megnyitása |
| **Ctrl + Shift + P** | Parancs paletta |
| **Ctrl + `** | Terminál megnyitása |
| **F12** | Ugrás definícióra |
| **Ctrl + S** | Mentés (Prettier automatikusan formáz) |
| **Ctrl + Shift + F** | Keresés az összes fájlban |
| **Alt + Shift + F** | Kód formázása (Prettier) |
| **Ctrl + B** | Oldalsáv ki/be |

## 8. Projektstruktúra navigálás

| Parancs | Mit csinál |
|---|---|
| `cd D:\Prog\photo-album` | Belépés a projekt gyökerébe |
| `cd backend` | Belépés a backend mappába |
| `cd frontend` | Belépés a frontend mappába |
| `dir` | Fájlok listája az aktuális mappában |
| `dir /a` | Rejtett fájlok is (pl. `.env`) |
| `cd ..` | Egy szinttel feljebb |
| `cd \` | A meghajtó gyökerébe |

## 9. Napi rutin – munka kezdése

```powershell
# 1. Belépés a projektbe
cd D:\Prog\photo-album

# 2. Teljes stack indítása Dockerben
docker compose up -d --build

# 3. Böngészőben:
#    http://localhost:3000      (frontend)
#    http://localhost:8080/api/photos  (REST API)
#    http://localhost:8080/swagger-ui.html  (Swagger)
```

**Ha nem Dockerben akarsz dolgozni:**

```powershell
# 1. Csak a DB indítása
docker compose up -d postgres

# 2. Backend NetBeans-ből (F6) vagy:
cd backend
.\mvnw.cmd spring-boot:run

# 3. Frontend külön ablakban:
cd frontend
npm run dev
```

## 10. Napi rutin – munka befejezése

```powershell
# 1. Változások ellenőrzése
cd D:\Prog\photo-album
git status

# 2. Commit és push
git add .
git commit -m "Leíró üzenet"
git push

# 3. Konténerek leállítása
docker compose down
```

## 11. Teljes tesztelés

Amikor az egész stacket ellenőrizni akarod:

```powershell
# 1. Teljes stack újraépítése és futtatása
cd D:\Prog\photo-album
docker compose down
docker compose up --build

# 2. Böngészőben:
#    - http://localhost:3000              (React frontend)
#    - http://localhost:8080/api/photos   (REST API)
#    - http://localhost:8080/swagger-ui.html  (Swagger UI)
```

## 12. Hibakeresési gyorssegéd

| Probléma | Első parancs |
|---|---|
| „Backend nem indul" | `docker ps` – fut-e a PostgreSQL? |
| „Adatbázis nem elérhető" | `docker compose logs postgres` |
| „Dialect hiba" | `docker compose up -d postgres` |
| „Docker port ütközés" | `docker compose down` |
| „Build hiba" | `docker compose logs <service> --tail 50` |
| „Nginx nem továbbítja az API-t" | `docker exec photo-album-frontend nginx -t` |
| „CORS hiba" | Ellenőrizd a `CorsConfig.java`-t (allowed origins) |
| „Frontend nem tölti be az adatot" | Böngésző F12 → Network fül |
| „npm ci hiba" | `cd frontend && npm install` (lock fájl szinkron) |
| „Fájlkiterjesztés-probléma" | `Get-ChildItem <fájlnév>*` |
| „Valami nem működik" | `git status` + `docker ps` + konzolok |

## 13. Projekt specifikus információk

| Elem | Érték |
|---|---|
| **Projekt gyökér** | `D:\Prog\photo-album` |
| **Backend mappa** | `D:\Prog\photo-album\backend` |
| **Frontend mappa** | `D:\Prog\photo-album\frontend` |
| **Backend port** | `8080` |
| **Frontend Docker port** | `3000` |
| **Frontend Vite dev port** | `5173` |
| **PostgreSQL port** | `5432` |
| **Adatbázis neve** | `photoalbum` |
| **Adatbázis felhasználó** | `photoalbum` |
| **Adatbázis jelszó** | *(lásd a `docker-compose.yml`-ben – fejlesztői jelszó)* |
| **Swagger UI URL** | `http://localhost:8080/swagger-ui.html` |
| **REST API URL** | `http://localhost:8080/api/photos` |
| **Frontend URL (Docker)** | `http://localhost:3000` |
| **Frontend URL (dev)** | `http://localhost:5173` |
| **GitHub repo** | `https://github.com/pogessor/photo-album` |
| **Gemini modell** | `gemini-3.5-flash-lite` |

## 14. Leggyakoribb 10 parancs

A mindennapi munkád során ezt a 10 parancsot fogod használni legtöbbször:

```
git status
git add .
git commit -m "..."
git push

docker compose up -d --build
docker compose down
docker compose logs <service> --tail 50

cd D:\Prog\photo-album
npm run dev
.\mvnw.cmd clean install
```