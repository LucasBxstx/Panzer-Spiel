# The ultimate Tank Game

**The ultimate Tank Game** is a real-time multiplayer browser game inspired by the thank mode from Wii Play,
reimagined with modern web technologies, enhanced graphics and customizable game settings.

Players can compete in fast-paced matches across different maps and game modes, either in 1v1 duels or team-based
battles. A single-player mode with bots is currently in development.

## Key Achievements

- Real-time multiplayer synchronization with WebSockets
- Custom collision detection with SAT (2D) and OBB
- Player-relative movement handling for dynamic camera perspectives
- Rule-based bots with line-of-sight, pathfinding, and difficulty-based shooting
- Mobile-optimized controls using dual virtual joysticks (NippleJS)

## Features

### Lobby System

- Create and join lobbies dynamically using websockets
- Configure game settings before match
- Game modes:
    - 1 vs 1
    - Team vs Team
    - Team vs Bots (available soon)
- Customizable lobby settings
    - Map selection
    - Number of teams
    - Players per team
- Automatic game start when lobby is full

### Multiplayer Gameplay

- Real-time online matches with multiple players using websockets
- Countdown for synchronized match start
- Win condition: last surviving team wins

### Cross-Platform Controls

Desktop

- Movement: WASD or arrow keys
- Aiming: Mouse (independent turret rotation)
- Shooting: Left click or Space

Mobile

- Dual virtual joystick system
- Smooth touch-based aiming and movement
- Optimized for responsive gameplay on smaller screens

### 3D Rendering and Maps

- Real-time 3D rendering using Three.js
- Using particle animations for explosions
- Multiple custom maps built from externally sourced 3D assets and textures (e.g. Sketchfab, public licenses)

### Realtime Architecture

- WebSocket-based communication using Socket.IO
- Efficient real-time synchronization of:
    - Player positions
    - Tank and turret rotations
    - shooting
    - Game state updates
- Backend gateway (WebSocket) for event-driven communication
- Frontend service layer for managing socket connections
- Event-based updates instead of full state polling

**Connection Handling**

- Robust handling of WebSocket disconnects:
    - Temporary disconnects do not immediately remove players
    - Players can rejoin ongoing matches
    - When players explicitly leave, they permanently exit the match

### Collision System

- Custom collision detection using Separating Axis Theorem (SAT)
- Optimized for 2D collision logic with Orient Bounding Boxes (OBB)

### Sound Effects

- Sound effects for
    - game countdown
    - victory / defeat
    - shooting a bullet
    - bullet hitting a tank
    - bullet hitting a wall
    - explosion

### Different Tank and Bullet Variants

Multiple tank types with distinct attributes:

- Movement speed
- Rotation speed
- Number of concurrent bullets

Multiple bullet types with unique properties:
- Speed
- Bouncing behavior (how many times a bullet can ricochet off walls)

Future enhancement: player selection of tank variants in the lobby for more strategic gameplay

## Tech Stack

### Frontend

- Angular (v20.3.10)
- Three.js (3D rendering)
- NippleJS (mobile controls)
- RxJS (state & event handling)
- Socket.IO Client (real-time communication)
- Tailwind CSS (styling)

### Backend

- NestJS (v11.0.12)
- MikroORM (ORM & migrations)
- Socket.IO (WebSocket Gateway)
- JWT Authentication

### Database

- PostgreSQL

### Tooling & DevOps

- Docker
- Swagger (API documentation)
- ESLint (linting)
- Prettier (code formatting)

## Local Setup

To set up the project locally, ensure to have installed

- Docker Desktop >= 28.3.2
- Node.js >= 24.11.1
- Angular CLI 20 (if you want to run angular outside docker)

1. Clone the repository:

```
git clone https://github.com/LucasBxstx/Panzer-Spiel
```

2. Install dependencies for each frontend and backend from the folders `/ui` and `/backend`:

```
npm i
```

3. Create an .env file in the root folder of the repository with following content:

```
NODE_ENV=development
DB_HOST=db
DB_PORT=5434
DB_NAME=tankDB
DB_USERNAME=tank-admin
DB_PASSWORD=chooseYourOwnPassword
DB_MAX_CONNECTIONS=50
JWT_SECRET=generateYourOwnJWTSecret
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:4200
```

choose your own `DB_PASSWORD` and `JWT_SECRET`!

4. Run the applicaton with Docker:

You can run frontend + backend + database via Docker:

```
docker compose up
```

However, for local development we recommend running the database locally and not via Docker, to be able to generate
migrations.
For this purpose, create your own PostgreSQL database and adjust the `.env` file with the according parameters.

Note for Windows Users:
If you have PostgreSQL installed locally, it may conflict with this Docker setup.

- Press `Win + R`, type `services.msc`, and hit Enter.
- Locate the service named `postgresql-x64-[version]`.
- Right-click and select Stop (or Restart if your local client crashed).

To run frontend and backend locally, use:

```
// backend folder
npm run start

// frontend folder
npm run start
```

5. Now the application should run

```
// frontend
http://localhost:4200

// backend - swagger
http://localhost:3000/api-docs
```

## Usage

### Multiplayer Mode

#### Starting a game

- Create a Lobby or join an existing Lobby by other players
- When creating a lobby, you can select
    - the `Map`
    - the  `Game Mode`: `1 vs 1` or `Team vs Team`
    - specify the `number of Teams` and `number of Players` per
      Team
    - finally open the lobby, to let other players join
- Game begins after countdown

#### Goal of the Game

Every player has its own tank. Destroy all enemy tanks. The last surviving team wins.

#### Controls

The game can be played on PC or Mobile.

##### PC

- Move your tank with `w` `a` `s` `d` or the arrow keys
- Aim on other tanks with your mouse. The tank turret will rotate depending on where you aim
- Shoot by `left click` or pressing `space`

##### Mobile

- Move your tank with the left joystick
- Aim on other tanks by rotating the tank turret with the right joystick
- Shoot by pressing somewhere on the screen

### Single Player Mode

Currently in development.
Will include bots and level-based gameplay.

## Technical Challenges

### WebSockets Reliability:

- Handling unstable connections
- Designing a rejoin system without breaking the game state

### Player-relative movement and perspective handling:

- Every player has its own perspective on the map, such that the own tank is displayed at the bottom
- Player input (e.g. WASD) must always be interpreted relative to the player's current camera perspective
- At the same time, all other players must see the movement correctly in world space

### Implementing bots for single player mode:

- Target selection:
    - Bots determine the nearest opponent using Euclidean distance
    - The closest player becomes the current target
- Line of Sight Detection:
    - Before shooting, bots evaluate whether a clear line of sight to the target exists
    - Implemented by:
        - Spanning a virtual collision object between bot and target
        - Checking for intersection with map obstacles
    - This ensures bots only shoot when no obstruction is present
- Difficulty-based shooting behavior:
    - Accuracy is adjusted based on difficulty level of the bot
    - Randomized deviation from the exact target direction
- Pathfinding and navigation:
    - When no clear line of sight exists, bot must navigate toward the target
    - To determine the path to the target along other obstacles the following approach was chosen:
        - The map is divided into chunks (grid-based spatial partitioning)
        - A navigation graph / mesh is generated with each chunk representing a node and the neighboring chunks
          representing edges (adjacency list)
    - Pathfinding is implemented using a variation of the **A-Star algorithm**
        - Nodes are prioritized based on distance to the target
        - Uses a priority queue for efficient traversal
        - Stops early when a valid path is found (to optimize performance)
    - Movement Execution:
        - Calculated paths from chunk to chunk are translated into actual tank movement

## Future Improvements

- Complete the Bot system for singleplayer mode
- Enable bots in multiplayer matches
- Design and implement multiple levels/maps for singleplayer gameplay
- Store match statistics and player performance data
- Implement a real-time online player list to show who is currently in-game


