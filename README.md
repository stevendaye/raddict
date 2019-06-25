# raddict
Raddict | A light-weight social network where you can share your thoughts and pictures with friends and families.

Raddict is a light-weight and simple social network platform where users can post their thoughts and pictures in real time,
for others to like and comment. It also offers the possiblity for users to chat privately in real time.

This project was created to put together all the things I learned during my Full Stack Web Development Training. These include:
* Server Side Programming with Node.js
* Databases like MongoDB, MySQL, SQLite3
* Local authentication and Twitter, Facebook and Google Login support
* Security: SSL/TLS, Cross Forgery Request
* Deployment on Cloud Services and Load Balancing Technics
* Docker
* Texting: TDD/BDD (Mocha, Chai, Pupeteer)
* Microservice
* Full Responsiveness
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
  - npm install || npm i --force
  - npm start (in one console. This is to be kept running as it is a microserice)

  /*Post Directoy*/
  - cd posts/
  - npm install || npm i --force
  - npm start

# MUST READ CAREFULLY
  - Make sure the /*users*/ microservive is running in another console before running the /*posts*/ microservice.

  - See "pub" file and rename it to ".env". I have provided fake api token keys for facebook, twitter and google. This will enable you
    to run the app without third-party authentication services. However, you can create your third-party tokens and credentials
    for testing user authentication.

  - Depending on your OS, You might encounter an error when installing dependencies in the /*posts*/ microservice. It is usually
    the /*node-gyp-build*/ error due to the /*level@5.0.1*/ Local Storage Database that installs automatically the
    /*levelup@5.0.1 and leveldown@5.0.3*/. So, just make sure you force the installation.

  - Depending on your OS, you might also encounter an error that says /*let url=moduleWrapResolve(specifier, parentURL)*/. This is due
    to the fact that I am using ES6 Modules instead of COMMONJS. So the paths to import modules are not being resolved. In this case,
    just open the /*users*/ and /*posts*/ microservices and add in the start script, right after nodemon or node the following command:
    /*--es-module-specifier-resolution=node*/, and you are good to go.
