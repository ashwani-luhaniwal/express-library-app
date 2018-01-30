---------------------------
What databases can I use ?
---------------------------
Express apps can use any database supported by Node (Express itself doesn't define any specific 
additional behaviour/requirements for database management). There are many popular options, including 
PostgreSQL, MySQL, Redis, SQLite, and MongoDB.

When choosing a database, you should consider things like time-to-productivity/learning curve, 
performance, ease of replication/backup, cost, community support, etc. While there is no single "best" 
database, almost any of the popular solutions should be more than acceptable for a small-to-medium-sized 
site like our Local Library.

---------------------------------------------------
What is the best way to interact with a database ?
---------------------------------------------------
There are two approaches for interacting with a database: 
    - Using the databases' native query language (e.g. SQL)
    - Using an Object Data Model ("ODM") / Object Relational Model ("ORM"). An ODM/ORM represents the 
      website's data as JavaScript objects, which are then mapped to the underlying database. Some ORMs 
      are tied to a specific database, while others provide a database-agnostic backend.

The very best performance can be gained by using SQL, or whatever query language is supported by the 
database. ODM's are often slower because they use translation code to map between objects and the 
database format, which may not use the most efficient database queries (this is particularly true if 
the ODM supports different database backends, and must make greater compromises in terms of what database 
features are supported).

The benefit of using an ORM is that programmers can continue to think in terms of JavaScript objects 
rather than database semantics — this is particularly true if you need to work with different databases 
(on either the same or different websites). They also provide an obvious place to perform validation and 
checking of data.

----------------------------
What ORM/ODM should I use ?
----------------------------
A few solutions that were popular at the time of writing are:
    - Mongoose: Mongoose is a MongoDB object modeling tool designed to work in an asynchronous 
        environment.
    - Waterline: An ORM extracted from the Express-based Sails web framework. It provides a uniform 
        API for accessing numerous different databases, including Redis, mySQL, LDAP, MongoDB, and 
        Postgres.
    - Bookshelf: Features both promise-based and traditional callback interfaces, providing transaction 
        support, eager/nested-eager relation loading, polymorphic associations, and support for 
        one-to-one, one-to-many, and many-to-many relations. Works with PostgreSQL, MySQL, and SQLite3.
    - Objection: Makes it as easy as possible to use the full power of SQL and the underlying database 
        engine (supports SQLite3, Postgres, and MySQL).
    - Sequelize is a promise-based ORM for Node.js and io.js. It supports the dialects PostgreSQL, 
        MySQL, MariaDB, SQLite and MSSQL and features solid transaction support, relations, read 
        replication and more.

As a general rule you should consider both the features provided and the "community activity" (downloads, 
contributions, bug reports, quality of documentation, etc.) when selecting a solution. At time of writing 
Mongoose is by far the most popular ORM, and is a reasonable choice if you're using MongoDB for your 
database.

-------------------------------------------------
Using Mongoose and MongoDB for Local Library App
-------------------------------------------------
For the Local Library example (and the rest of this topic) we're going to use the Mongoose ODM to access 
our library data. Mongoose acts as a front end to MongoDB, an open source NoSQL database that uses a 
document-oriented data model. A “collection” of “documents”, in a MongoDB database, is analogous to 
a “table” of “rows” in a relational database.

This ODM and database combination is extremely popular in the Node community, partially because the 
document storage and query system looks very like JSON, and is hence familiar to JavaScript developers.

--------------------------------
Installing Mongoose and MongoDB
--------------------------------
Mongoose is installed in your project (package.json) like any other dependency — using NPM. To install 
it, use the following command inside your project folder:

    npm install mongoose

Installing Mongoose adds all its dependencies, including the MongoDB database driver, but it does not 
install MongoDB itself. If you want to install a MongoDB server then you can download installers from 
here for various operating systems and install it locally. You can also use cloud-based MongoDB instances.

-----------------------------
Defining and creating models
-----------------------------
Models are defined using the Schema interface. The Schema allows you to define the fields stored in 
each document along with their validation requirements and default values. In addition, you can define 
static and instance helper methods to make it easier to work with your data types, and also virtual 
properties that you can use like any other field, but which aren't actually stored in the database

Schemas are then "compiled" into models using the mongoose.model() method. Once you have a model you 
can use it to find, create, update, and delete objects of the given type.

Note: Each model maps to a collection of documents in the MongoDB database. The documents will contain 
the fields/schema types defined in the model Schema.

--------------------------
Methods and query helpers
--------------------------
A schema can also have instance methods, static methods, and query helpers. The instance and static 
methods are similar, but with the obvious difference that an instance method is associated with a 
particular record and has access to the current object. Query helpers allow you to extend mongoose's 
chainable query builder API (for example, allowing you to add a query "byName" in addition to the 
find(), findOne() and findById() methods).
