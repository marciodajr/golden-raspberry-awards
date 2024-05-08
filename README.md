# Golden Raspberry Awards API

RESTful API for reading the list of nominees and winners
in the Worst Film category at the Golden Raspberry Awards.

## Motivation

Obtain the producer with the longest interval between two consecutive awards, and the one who obtained two awards the fastest.

New files can be imported within **src/csv** reading the directory is recursive so just add the file with the expected layout.

### Clone Repository

```bash
git clone git@github.com:marciodajr/golden-raspberry-awards.git
```

### Installation

```bash
npm install
```

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Test

```bash
# unit tests
$ npm run test
```

### Accessing

- Access [http://localhost:3000](http://localhost:3000) if the Swagger page returns are working correctly.
