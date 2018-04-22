# Spark Test: Filtering Matches
* Fullstack JavaScript project, using Node.js.

* The project was developed using a cloud9 node.js workspace.

* The following need to be installed as prerequisites:
    - node.js
    - mongoDB server

* Listening IP/port and mongoDB server & credentials have to be updated accordingly in index.js and config/default.json files.

# (Optional) C9 installation instructions
* Login on https://c9.io and create new workspace:
    - set name & description and choose Node.js template
    - (optional) once entered the workspace, you may want to remove existing project
* Install & run mongod via terminal:
    ```
    alilego:~/workspace $ cd ..
    alilego:~ $ sudo apt-get install -y mongodb-org
    alilego:~ $ mkdir data
    alilego:~ $ echo 'mongod --bind_ip=$IP --dbpath=data --nojournal --rest "$@"' > mongod
    alilego:~ $ chmod a+x mongod
    alilego:~ $ ./mongod 
    ```
* Get the filtering matches app from git:
    - open a new terminal (Alt + T)
    - clone the repository, install dependencies, seed the DB and run the app (make sure mongod is still listening):
    ```
    alilego:~/workspace $ git clone https://github.com/alilego/spark-test.git
    alilego:~/workspace $ cd spark-test/
    alilego:~/workspace/spark-test (master) $ npm install
    alilego:~/workspace/spark-test (master) $ node public/seed.js
    alilego:~/workspace/spark-test (master) $ node index.js
    ```
    - test app:
        - click on "Preview" top button, then click "Open the App" red button on the opened browser tab
        - test app (same URI can be opened in an independent browser)
* Upon exit, terminate both mongod and node instance (as workspace instance may shutdown til next login => state/config issues)


# Run app
* Prerequisites: 
    - mongoDB server shall be up and running (use ./mongod)

* The server can be started by running the following command in its root directory:
    $ node index.js

* '/' route is used to for all operations


# UT
* Mocha UT framework is used. One can run all unit tests using the following command:
    $ npm test
    
    
# DB 
* The DB instance is created automatically when running the app. 
* To seed the DB, run the following command in the root directory:
    $ node public/seed.js
* To improve the performance one should add indexes for the fields used for filtering:
    - >> use spark_match
    - >> db.users.createIndex({ geo : "2dsphere", compatibility_score : -1, height_in_cm : 1, age : 1 })
    
# Compatibility
* The application was tested on Chrome version 66.0 and Firefox version 59.0.2
* It should also work on Edge.
* It might not work on IE versions earlier than 9.

# Functional specifications (explanations) 
* Yes/no filters are interpreted in this  manner: 
    - if no is selected (unchecked), the filter is ignored
    - if yes is selected (checked), the filter is applied
* I chose this behavior (instead of e.g. for no photos to show only profiles with no photo) as this is the usual/expected behavior for this kind of filters

* "In contact = yes" was interpreted as: "contacts exchanged = positive number"

* Based on provided requirements, compatibility score seems to never be 100%. Thus, other than initial display of all users, a 100% compatibility can't be selected.

# Implementation process
* I made several assumptions in the implementation process, including:
    - DB fields are validated upon insertion, thus matches shouldn't contain invalid values
    - a user is already logged in (no addtional security checks for the exercise), his name is Vladimir (as he gets girl results) and his location is the same as Maria's from the data provided

* Several improvements are required to provide decent behavior:
    - react or a similar framework that compares DOMs to be used to avoid rerendering of all elements during filtering
    - lazy loading to be implemented to avoid overloading
    - profile images should finally have the same size/format, otherwise it won't look nice 

* BTW, nice touch with the kittens gifs :+1: It is a pleasure to test and retest the app :)
