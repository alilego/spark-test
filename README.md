# Spark Test: Filtering Matches
Fullstack JavaScript project, using Node.js.

The project was developed using a cloud9 node.js workspace.

The following need to be installed as prerequisites:
    - node.js
    - mongoDB server

Listening IP/port and mongoDB server & credentials have to be updated accordingly in index.js file.

# Run app
Prerequisites: 
    - mongoDB server shall be up and running (use ./mongod)

The server can be started by running the following command in its root directory:
    $ node index.js


# UT
Mocha UT framework is used. One can run all unit tests using the following command:
    $ npm test
    
    
# DB 
The DB instance is created automatically. 
To initialize the DB, uncomment the "DB.initUsers(User, log)" line in index.js
To improve the performance one should add indexes for all fields used for filtering:
    - TODO
    
# Compatibility
The application was tested on Chrome version 66.0.3359.117
It should also work on Firefox and Edge.
It might not work on IE versions earlier than 9.

# Implementation process
I made several assumptions in the implementation process, including:
    - DB fields are validated upon insertion, thus matches shouldn't contain invalid values
    - a user is already logged in (no addtional security checks for the exercise), his name is Vladimir (as he gets girl results) and his location is the same as Maria from the example provided
    - compatibility score is never 100% (in fact this seems to be a requirement assumption)

Several improvements are required to provide decent behavior:
    - react or a similar framework that compares DOMs to be used to avoid rerendering of all elements during filtering
    - profile images should finally have the same size/format, otherwise it won't look nice 

BTW, nice touch with the kittens gifs: it is a pleasure to test and retest the app :)
