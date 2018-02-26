# FeedMe

Project consuming and recording data from provider TCP server.

For **Back-end** of the application I chose **Node JS** (with **Express**), because it works pretty well with large volumes of data and with real-time data.

For the NoSQL database I chose **MongoDB** because it works well with real-time data.

For **Front-end** I chose **React JS** because it works very fast and shows the new incoming data instantly. On the front end there is a socket client (I used **socket.io**) that receives live data and updates the page when needed. This way, the user instantly sees the new data and always has the latest information.

For **Unit Testing** I chose **Mocha** as a testing framework and **Chai** as an assertion library. They have a pretty good API, which makes them very convenient for writing unit tests.

Steps to start the project:

1. Start **MongoDB**, configured to listen for connection to host **127.0.0.1** and port **27017**.
2. Start the TCP server (the service provider).
3. Open the app folder and go to **server/config.js**. There you need to configure the **host** and the **port** on which the TCP server works.
4. Open the app folder and go to the **server** folder. Open the console from it and run the command **npm install**. Then, from the same folder, open the console and start the **http server** (Back-end) through the **node index.js** command.
5. Open the app folder and go to the **client** folder. Open the console from it, run the command **npm install**. Then, from the same folder, open the console and start the client (Front-end) through the **npm run start** command.

**Front-end** is available at **127.0.0.1:3000** and the **http server** runs on **127.0.0.1:8787**
