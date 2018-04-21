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
However, to improve the performance one should add indexes for all fields used for filtering:
    - TODO
    

# Implementation process
Note: I chose a technology that seemed more appropriate for the task instead of the stuff I was used to(i.e. mostly backend), that's why the implementation was rather exploratory than planned - as can be seen from git history

I made several assumptions in the implementation process, including:
    - a user is already logged in (no addtional security checks for the exercise), his name is Vladimir (as he gets girl results) and his location is the same as Maria from the example provided
    - profile images should finally have the same size, otherwise it won't look nice (it's not the case for this test)
    - compatibility score is never 100% (in fact this seems to be a requirement assumption)

Btw, nice touch with the kittens gifs: it was a pleasure to test and retest the app :)
