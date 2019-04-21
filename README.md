# raddict
Raddict | A Simple Thought or Small Article Sharing Platform Among Developers

Raddict is simple project where users can post little articles or their thoughts in real time, for other users to read and comment
It also offers the possiblity for users to chat privately in real time.

This project was created to put together all the things I learned during my Full Stack Web Development Training. These include:
* Server Side Programming with Node
* Databases like MongoDB, MySQL, SQLite3
* Local authentication and Twitter, Facebook and Google Login support
* Security: SSL/TLS, Cross Forgery Request
* Deployment on Cloud Services and Load Balancing Technics
* Docker
* Texting: TDD/BDD
* && many other skills that I might be missing in this list

# Technologies Used
- Node.js && Expressjs
- Handlebars.js (Decided not to use React/Redux here but to experiment more with HBS. The former is used in Platolio Project)
- SQLite3, MySQL, Sequelize, MongoDB
- Bootstrap

# To run the project
- npm install
- npm start [will store data in memory]
- npm run start-fs [will persist data into a filesystem]
- npm run start-level [will persist data locally in the browswer]
- npm run start-sqlite3 [will persist data in SQLite3 Database]
- npm run server-dbType1(2 || 3) [will run another instance of the app sharing the same data except when running: start & start-level]
