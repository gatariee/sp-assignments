# BED CA2 

## Sample Admin Account
- Username: `admin`
- Password: `admin`

## Sample User Account
- Username: `test`
- Password: `test`


## Prerequisites
- [Node.js](https://nodejs.org/en/) (v16.17.0 or higher)
- [Nodemon](https://www.npmjs.com/package/nodemon) (v2.0.22 or higher)
- [npm-run-all](https://www.npmjs.com/package/npm-run-all) (v4.1.5 or higher)
- MySQL server running on TCP/3306, see [here](./server/databases/db.js#L11)
  - MySQL database is called `main`, see [here](./server/databases/db.js#L10)
- Ensure that ports: TCP/80 and TCP/3000 are not in use.
   - TCP/80 is used by the frontend, see [here](./client/index.js)
   - TCP/3000 is used by the backend, see [here](./server/index.js)

## Setup
1. Navigate to ./server/ and create/edit a file called ".env" and edit the contents accordingly:

   ```env
    DB_PASSWORD = "<db_password>"
    JWT_SECRET = "<jwt_secret>"
    ```
-  Example `.env` file:
 
    ```env
    DB_PASSWORD = "super_secret_password"
    JWT_SECRET = "abcdefg"
    ```
2. Navigate to your MySQL workbench and initialize the database using [main.sql](./server/databases/main.sql):
   1. Create a new database schema called `main`
   2. Select the `main` schema by double clicking on it
   3. Hover over the `Server` button and select `Data Import`
   4. Select `Import from Self-Contained File` and select the [main.sql](./server/databases/main.sql) file
   5. Change the `Default Target Schema` to `main`
   6. Change the tab to `Import Progress` and click `Start Import`
   7. If everything went well, you should see a message that looks like this:
       - ```16:53:05 Import of C:\Users\PC\Desktop\git\BED-CA2\server\databases\main.sql has finished```


## Deployment

### Option 1: `npm start`
1. Ensure that the prerequisites are installed, and that the .env file is created/edited.
2. Navigate to the root directory of the project and run `npm start`.
   - The root directory is the directory that contains this file [package.json](./package.json).
3. Run `npm start` in the root directory of the project.
    - Sample output:
        ```ps
        PS C:\Users\PC\Desktop\git\BED-CA2> npm start
        > bed-ca2@1.0.0 start
        > npm-run-all --parallel start-server start-client

        > bed-ca2@1.0.0 start-client
        > cd client && nodemon .    

        > bed-ca2@1.0.0 start-server
        > cd server && nodemon .    

        [nodemon] 2.0.22
        [nodemon] 2.0.22
        [nodemon] to restart at any time, enter `rs`
        [nodemon] to restart at any time, enter `rs`
        [nodemon] watching path(s): *.*
        [nodemon] watching path(s): *.*
        [nodemon] watching extensions: js,mjs,json  
        [nodemon] watching extensions: js,mjs,json  
        [nodemon] starting `node .`
        [nodemon] starting `node .`
        [Frontend] Server listening at: http://localhost:80
        [db_config.js] Initializing DB Connection Pool...
        [db_config.js] DB Connection OK. 10 concurrent connections allowed.
        [Backend] Server listening at: http://localhost:3000
        ```
4. Open a browser and navigate to http://localhost:80
5. To stop the server, press `Ctrl + C` in the terminal.
6. To restart the server, type `rs` in the terminal.

### Option 2: `npm run start-server` and `npm run start-client`
1. Ensure that the prerequisites are installed, and that the .env file is created/edited.
2. Navigate to the root directory of the project and run `npm run start-server` in one terminal.
3. Navigate to the root directory of the project and run `npm run start-client` in another terminal.
4. If everything went well, you should see a message that looks like this:
    - ```[Frontend] Server listening at: http://localhost:80```
    - ```[Backend] Server listening at: http://localhost:3000```
    - If you see this message, it means that the server is running successfully.
5. Open a browser and navigate to http://localhost:80
6. To stop the server, press `Ctrl + C` in the terminal.
7. To restart the server, type `rs` in the terminal.

### Option 3: Manual Deployment
1. Ensure that the prerequisites are installed, and that the .env file is created/edited.
2. Open 2 terminals
   1. Navigate to the root of the `client` folder in one terminal.
   2. Navigate to the root of the `server` folder in another terminal.
   3. Run `node index.js` in both terminals.
   4. If everything went well, you should see a message that looks like this:
       - ```[Frontend] Server listening at: http://localhost:80```
       - ```[Backend] Server listening at: http://localhost:3000```
       - If you see this message, it means that the server is running successfully.
3. Open a browser and navigate to http://localhost:80


### Troubleshooting 
1. If you see this error message:
   - ```Error: listen EADDRINUSE: address already in use :::80```
       1. It means that the port TCP/80 is already in use.
       2. To fix this, you can either:
           - Stop the process that is using TCP/80
           - Change the port number in [index.js](./client/index.js#L2) to another port number that is not in use.

2. If you see this error message:
     -  ```Error: listen EADDRINUSE: address already in use :::3000```
      1. It means that the port TCP/3000 is already in use, this is slightly more troublesome than the previous error as the frontend makes direct calls to TCP/3000.
      2. You will need to change a few times:
         - Change the port number in [utils.js](./client/controller/utils.js#L5) to match the new port number.
         - Change the port number in [api.js](./client/public/js/api.js#L15) to match the new port number.
         - Change the port number in [login.js](./client/public/js/login.js#L110) to match the new port number.
         - Change the port number in [navbar.js L117](./client/public/js/navbar.js#L117) & [navbar.js L140](./client/public/js/navbar.js#L140) to match the new port number.
         - Changet he port number in [users.js](./client/public/js/users.js#L121) to match the new port number.
      3. Due to the number of port changes, it is highly recommended to free up TCP/3000 instead of changing the port number.
   
3. Any error related to npm packages can be fixed by manually installing the missing packages.
   - Example error message:
     - ```Error: Cannot find module 'express'```
   - Example fix:
     - ```npm install express```

