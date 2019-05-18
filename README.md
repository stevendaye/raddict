# raddict
Raddict | A Simple Thought or Small Article Sharing Platform Among Developers

Raddict is a simple project where users can post little articles or their thoughts in real time, for other users to read and comment. 
It also offers the possiblity for users to chat privately in real time.

This project was created to put together all the things I learned during my Full Stack Web Development Training. These include:
* Server Side Programming with Node.js
* Databases like MongoDB, MySQL, SQLite3
* Local authentication and Twitter, Facebook and Google Login support
* Security: SSL/TLS, Cross Forgery Request
* Deployment on Cloud Services and Load Balancing Technics
* Docker
* Texting: TDD/BDD (Mocha, Chai, Pupeteer)
* Microservice
* && many other skills that I might be missing in this list

# Technologies Used
- Node@10 && Expressjs
- Handlebars.js (Decided not to use React/Redux here but to experiment more with HBS. The former is used in Platolio Project)
- SQLite3, MySQL, Sequelize, MongoDB
- Bootstrap
- ES6/ES7
- Sockect.IO
- Restify

# To run the project
  /*User Directory*/
  - cd users/
  - npm install
  - npm start [in one console. This is to be kept running as it is a microserice]
  - npm run start-add-user [in another console]

  /*Post Directoy*/
  - cd posts/
  - npm install || npm i --force
  - npm run start [make sure the user microservive is running in another console]

  - npm run start-memory [will store data in memory]
  - npm run start-fs [will persist data into a filesystem]
  - npm run start-level [will persist data locally in the browswer]
  - npm run start-sqlite3 [will persist data in SQLite3 Database]
  - npm run start-sequelize [will persist data in SQLite3 Database using Sequelize]
  - npm run start-mongodb [will persist data in MongoDB. Just make sure you have a running mongodb instance]
  - npm run server-dbType1(2 || 3) [will run another instance of the app sharing the same data except when running: start & start-level]

# Important
 - See "pub" file and rename it to "pub.env". Do this after creating your third-party tokens and credentials for facebook,
   google and twitter for testing user authentication
