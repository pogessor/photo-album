\# Parancsok gyűjteménye



Ez a fájl a projekt során használt leggyakoribb parancsokat gyűjti össze rövid magyarázattal.

Célja, hogy gyors referenciaként szolgáljon a mindennapi munkához.



\## Tartalomjegyzék



\- \[1. Környezet ellenőrzése](#1-környezet-ellenőrzése)

\- \[2. Git – verziókezelés](#2-git--verziókezelés)

\- \[3. Docker – konténerek](#3-docker--konténerek)

\- \[4. Maven – build tool](#4-maven--build-tool)

\- \[5. NetBeans-specifikus műveletek](#5-netbeans-specifikus-műveletek)

\- \[6. Projektstruktúra navigálás](#6-projektstruktúra-navigálás)

\- \[7. Napi rutin – munka kezdése](#7-napi-rutin--munka-kezdése)

\- \[8. Napi rutin – munka befejezése](#8-napi-rutin--munka-befejezése)

\- \[9. Teljes tesztelés](#9-teljes-tesztelés)

\- \[10. Hibakeresési gyorssegéd](#10-hibakeresési-gyorssegéd)



\## 1. Környezet ellenőrzése



Ezeket egyszer-egyszer futtatjuk, hogy lássuk, minden telepítve van-e.



| Parancs | Mit csinál | Miért fontos |

|---|---|---|

| `java --version` | Megmutatja a Java verziót | Ellenőrizzük, hogy JDK 21+ van-e |

| `echo %JAVA\_HOME%` | Kiírja a JAVA\_HOME környezeti változót | A Maven és az eszközök ezt használják |

| `mvn -version` | Maven verzió | Ellenőrizzük, hogy a Maven elérhető |

| `git --version` | Git verzió | Verziókezelés ellenőrzése |

| `wsl --status` | WSL2 állapot | A Docker ezt használja Windows-on |

| `docker --version` | Docker verzió | Konténerek futtatásához |

| `docker compose version` | Docker Compose verzió | Több konténeres projekt |

| `docker run hello-world` | Teszt konténer futtatása | Első ellenőrzés, hogy a Docker működik |

| `chcp 65001` | Konzol kódlaptábla UTF-8-ra | Ékezetes karakterek megjelenítése |

| `node --version` | Node.js verzió | Frontend fejlesztéshez (később) |

| `npm --version` | npm (Node Package Manager) verzió | Frontend csomagok kezelése |



\## 2. Git – verziókezelés



Ez a \*\*napi rutin\*\* – minden értelmes lépés után futtatjuk.



| Parancs | Mit csinál | Miért fontos |

|---|---|---|

| `git init` | Új git repository inicializálása | Egyszer kell, a projekt elején |

| `git status` | Megmutatja a változásokat | Mindig ezzel kezdünk – mit változtattunk? |

| `git add .` | Az összes változást staging-be teszi | A commit előtt kell |

| `git add <fájl>` | Csak egy konkrét fájlt ad hozzá | Ha nem akarunk mindent commitolni |

| `git add -f <fájl>` | Kényszerített hozzáadás `.gitignore` ellenére | A `test.jpeg` esetén használtuk |

| `git commit -m "..."` | Commit létrehozása üzenettel | Egy logikai egység mentése |

| `git commit -m "cím" -m "leírás"` | Commit cím + részletes leírás | Profibb, olvashatóbb commit-történet |

| `git commit --amend` | Az utolsó commit módosítása | Ha elrontottuk az üzenetet |

| `git commit --amend -F commit-msg.txt` | Commit üzenet fájlból | Hosszú üzenethez a legbiztosabb |

| `git log --oneline` | Commitok listája röviden | Múltbeli commitok áttekintése |

| `git log --oneline -3` | Utolsó 3 commit | Gyors ellenőrzés |

| `git ls-files \\| findstr env` | Követett fájlok szűrése | Ellenőrizzük, hogy a `.env` nincs benne |

| `git remote add origin <url>` | Távoli repo hozzáadása | Egyszer, a GitHub repo csatlakoztatása |

| `git branch -M main` | Branch átnevezése `main`-re | A GitHub ezt használja alapból |

| `git push` | Feltolja a commitokat a GitHubra | Hogy mások lássák |

| `git push -u origin main` | Első push + tracking beállítás | Utána elég csak `git push` |

| `git config --global user.name "Név"` | Git felhasználónév beállítása | Egyszer kell |

| `git config --global user.email "email"` | Git email beállítása | Egyszer kell |

| `git config --global core.editor "notepad"` | Alapértelmezett szerkesztő beállítása | `git commit --amend`-hez hasznos |

| `git config --global core.autocrlf true` | Sorvég-kezelés beállítása | A CRLF/LF figyelmeztetések eltüntetése |



\## 3. Docker – konténerek



\### 3.1 – Konténer életciklus



| Parancs | Mit csinál | Miért fontos |

|---|---|---|

| `docker ps` | Futó konténerek listája | Látod, mi fut éppen |

| `docker ps -a` | Az összes konténer (leállított is) | Debugoláshoz |

| `docker compose up -d postgres` | Csak a PostgreSQL indítása háttérben | Fejlesztéskor erre van szükség |

| `docker compose up --build` | Újraépít + indít (foreground) | Teljes stack futtatása |

| `docker compose up -d --build` | Ugyanaz, de háttérben | Nem foglalja a terminált |

| `docker compose down` | Konténerek leállítása | Nem törli a volume-okat |

| `docker compose logs postgres` | A PostgreSQL konténer naplója | Hibakereséshez |

| `docker compose logs backend` | A backend konténer naplója | Hibakereséshez |

| `docker compose logs -f <service>` | Élő naplókövetés | Folyamatos figyelés |

| `docker exec -it photo-album-postgres psql -U photoalbum -d photoalbum` | Belépés a PostgreSQL-be | Adatbázis-műveletekhez |



\### 3.2 – PostgreSQL parancsok (a `psql`-en belül)



| Parancs | Mit csinál |

|---|---|

| `\\dt` | Táblák listája |

| `\\d photo` | A `photo` tábla szerkezete |

| `\\l` | Adatbázisok listája |

| `\\q` | Kilépés |



\## 4. Maven – build tool



| Parancs | Mit csinál | Miért fontos |

|---|---|---|

| `mvnw.cmd clean install` | Töröl + újrafordít + csomagol + telepít | Teljes build, parancssorból |

| `mvnw.cmd spring-boot:run` | Az alkalmazás futtatása | Parancssori indítás |

| `mvnw.cmd test` | Csak a tesztek futtatása | Gyors tesztelés |

| `mvnw.cmd clean` | A `target/` mappa törlése | Tiszta build előtt |

| `mvnw.cmd dependency:tree` | Függőségek fa szerkezete | Konfliktusok felderítése |

| `mvnw.cmd help:effective-pom` | A teljes, feloldott POM kiírása | Debugoláshoz |



\*\*Megjegyzés:\*\* a NetBeans-ben a \*\*Clean and Build\*\* és a \*\*Run\*\* gombok ugyanezeket a parancsokat futtatják a háttérben.



\## 5. NetBeans-specifikus műveletek



| Művelet | Mit csinál |

|---|---|

| \*\*Alt + Insert\*\* | Kód generálás (getter/setter, konstruktor) |

| \*\*Ctrl + Shift + I\*\* | Importok rendezése |

| \*\*F6\*\* | Projekt futtatása |

| \*\*Shift + F6\*\* | Projekt debug módban |

| \*\*Ctrl + S\*\* | Mentés (mindig!) |

| \*\*Ctrl + Shift + F\*\* | Formázás |



\## 6. Projektstruktúra navigálás



| Parancs | Mit csinál |

|---|---|

| `cd D:\\Prog\\photo-album` | Belépés a projekt gyökerébe |

| `cd backend` | Belépés a backend mappába |

| `cd frontend` | Belépés a frontend mappába (később) |

| `dir` | Fájlok listája az aktuális mappában |

| `dir /a` | Rejtett fájlok is (pl. `.env`) |

| `cd ..` | Egy szinttel feljebb |

| `cd \\` | A meghajtó gyökerébe |



\## 7. Napi rutin – munka kezdése



Ez a leggyakoribb szekvencia reggel, amikor elkezdesz dolgozni:



```powershell

\# 1. Belépés a projektbe

cd D:\\Prog\\photo-album



\# 2. Adatbázis indítása (ha nem fut)

docker compose up -d postgres



\# 3. Backend indítása NetBeans-ből (F6)

\# VAGY parancssorból:

cd backend

.\\mvnw.cmd spring-boot:run

```



\## 8. Napi rutin – munka befejezése



Amikor befejezed a munkát:



```powershell

\# 1. Változások ellenőrzése

cd D:\\Prog\\photo-album

git status



\# 2. Commit és push

git add .

git commit -m "Leíró üzenet"

git push



\# 3. Konténerek leállítása

docker compose down

```



\## 9. Teljes tesztelés



Amikor az egész stacket ellenőrizni akarod Dockerben:



```powershell

\# 1. Teljes stack újraépítése és futtatása

cd D:\\Prog\\photo-album

docker compose down

docker compose up --build



\# 2. Böngészőben:

\#    - http://localhost:8080/api/photos

\#    - http://localhost:8080/swagger-ui.html

```



\## 10. Hibakeresési gyorssegéd



| Probléma | Első parancs |

|---|---|

| „Backend nem indul" | `docker ps` – fut-e a PostgreSQL? |

| „Adatbázis nem elérhető" | `docker compose logs postgres` |

| „Dialect hiba" | `docker compose up -d postgres` (az adatbázis nem fut) |

| „Docker port ütközés" | `docker compose down` |

| „Build hiba" | `mvnw.cmd clean install` (parancssorból, hogy lásd a hibát) |

| „Valami nem működik, nem tudom mi" | `git status` + `docker ps` + NetBeans konzol |

| „Furcsa karakterek a konzolon" | `chcp 65001` (cmd-ben) |



\## 11. Amit érdemes tudni



\- \*\*PowerShell vs. cmd:\*\* a legtöbb parancs ugyanaz, de a \*\*többsoros commit üzenetekhez\*\* PowerShell kell (here-string `@"..."@`).

\- \*\*A `mvnw.cmd` Windows-on\*\*, a `./mvnw` Linux/Mac-en – ugyanazt csinálja.

\- \*\*A `docker compose` (szóközzel)\*\* az új szintaxis; a régi `docker-compose` (kötőjellel) elavult.

\- \*\*A `-d` kapcsoló\*\* mindig „detached" (háttérben fut) – nem foglalja a terminált.

\- \*\*A `.env` fájl\*\* soha nem kerül a git-be – csak a `.env.example`.

\- \*\*A `uploads/` mappa\*\* soha nem kerül a git-be – kivéve a `test.jpeg`-et.



\## 12. Leggyakoribb 10 parancs



A mindennapi munkád során ezt a 10 parancsot fogod használni legtöbbször:



```

git status

git add .

git commit -m "..."

git push



docker compose up -d postgres

docker compose down

docker ps



cd D:\\Prog\\photo-album

dir

.\\mvnw.cmd clean install

```



\## 13. Projekt specifikus információk



| Elem | Érték |

|---|---|

| \*\*Projekt gyökér\*\* | `D:\\Prog\\photo-album` |

| \*\*Backend mappa\*\* | `D:\\Prog\\photo-album\\backend` |

| \*\*Frontend mappa\*\* | `D:\\Prog\\photo-album\\frontend` (később) |

| \*\*Backend port\*\* | `8080` |

| \*\*PostgreSQL port\*\* | `5432` |

| \*\*Adatbázis neve\*\* | `photoalbum` |

| \*\*Adatbázis felhasználó\*\* | `photoalbum` |

| \*\*Adatbázis jelszó\*\* | `photoalbum` |

| \*\*Swagger UI URL\*\* | `http://localhost:8080/swagger-ui.html` |

| \*\*REST API URL\*\* | `http://localhost:8080/api/photos` |

| \*\*GitHub repo\*\* | `https://github.com/pogessor/photo-album` |

