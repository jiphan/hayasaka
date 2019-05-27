# Hayasaka

Suite of discord bots.

- Hayasaka: takes song suggestions and adds them to Google Sheet. Other features TBD.
- Manager: manages redeployment of bots when code is updated (currently only supports rebooting Hayasaka).

## Installation

Requires `node` and `npm`. To set up:

```bash
npm install
```

## Running Bots

For now, bots should be run from the root directory of the project (subject to change).

### Hayasaka

```bash
npm start
```

### Manager

```bash
node manager/main.js
```

Starting up Manager will start up Hayasaka as a subprocess.

## Discord Commands

### Hayasaka

- `!ping`: Messages `pong!`  to the channel
- `!sheet`: Replies with link to con set list google sheet
- `!add <text>`: Adds "text" to notes section of con set list
- `!help`: Replies with list of commands

### Manager

- `MANAGER: ping`: Messages `screw off` to the channel
- `MANAGER: reboot`: Reboots Hayasaka with code currently on master branch
