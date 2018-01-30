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

-------------
Using models
-------------
Once you've created a schema you can use it to create models. The model represents a collection of 
documents in the database that you can search, while the model's instances represent individual 
documents that you can save and retrieve.

---------------------------------
Creating and modifying documents
---------------------------------
To create a record you can define an instance of the model and then call save(). The examples below 
assume SomeModel is a model (with a single field "name") that we have created from our schema.

    // Create an instance of model SomeModel
    var awesome_instance = new SomeModel({ name: 'awesome' });

    // Save the new model instance, passing a callback
    awesome_instance.save((err) => {
        if (err) return handleError(err);
        // saved!
    });

Note that creation of records (along with updates, deletes, and queries) are asynchronous operations
 — you supply a callback that is called when the operation completes. The API uses the error-first 
 argument convention, so the first argument for the callback will always be an error value (or null). 
 If the API returns some result, this will be provided as the second argument.

 You can also use create() to define the model instance at the same time as you save it. The callback 
 will return an error for the first argument and the newly-created model instance for the second 
 argument.

    SomeModel.create({ name: 'also_awesome' }, (err, awesome_instance) => {
        if (err) return handleError(err);
        // saved!
    });

Every model has an associated connection (this will be the default connection when you use 
mongoose.model()). You create a new connection and call .model() on it to create the documents on 
a different database.

You can access the fields in this new record using the dot syntax, and change the values. You have to 
call save() or update() to store modified values back to the database.

    // Access model field values using dot notation
    console.log(awesome_instance.name);     // should log 'also_awesome'

    // Change record by modifying the fields, then calling save()
    awesome_instance.name = 'New cool name';
    awesome_instance.save((err) => {
        if (err) return handleError(err);   // saved!
    });

----------------------
Searching for records
----------------------
You can search for records using query methods, specifying the query conditions as a JSON document. 
The code fragment below shows how you might find all athletes in a database that play tennis, 
returning just the fields for athlete name and age. Here we just specify one matching field (sport) 
but you can add more criteria, specify regular expression criteria, or remove the conditions altogether 
to return all athletes.

    let Athlete = mongoose.model('Athlete', yourSchema);

    // find all athletes who play tennis, selecting the 'name' and 'age' fields
    Athlete.find({'sport': 'Tennis'}, 'name age', (err, athletes) => {
        if (err) return handleError(err);
        // 'athletes' contains the list of athletes that match the criteria
    });

If you specify a callback, as shown above, the query will execute immediately. The callback will be 
invoked when the search completes.

Note: All callbacks in Mongoose use the pattern callback(error, result). If an error occurs executing 
the query, the error parameter will contain an error document, and result will be null. If the query is 
successful, the error parameter will be null, and the result will be populated with the results of 
the query.

If you don't specify a callback then the API will return a variable of type Query. You can use this 
query object to build up your query and then execute it (with a callback) later using the exec() method.

    // find all athletes that play tennis
    let query = Athlete.find({'sport': 'Tennis'});

    // selecting the 'name' and 'age' fields
    query.select('name age');

    // limit our results to 5 items
    query.limit(5);

    // sort by age
    query.sort({ age: -1 });

    // execute the query at a later time
    query.exec((err, athletes) => {
        if (err) return handleError(err);
        // athletes contains an ordered list of 5 athletes who play Tennis
    });

Above we've defined the query conditions in the find() method. We can also do this using a where() 
function, and we can chain all the parts of our query together using the dot operator (.) rather than 
adding them separately. The code fragment below is the same as our query above, with an additional 
condition for the age.

    Athlete
        .find()
        .where('sport').equals('Tennis')
        .where('age').gt(17).lt(50) // Additional where query
        .limit(5)
        .sort({ age: -1 })
        .select('name age')
        .exec(callback);    // where callback is the name of our callback function

The find() method gets all matching records, but often you just want to get one match. The following 
methods query for a single record:
    - findById(): Finds the document with the specified id (every document has a unique id).
    - findOne(): Finds a single document that matches the specified criteria.
    - findByIdAndRemove(), findByIdAndUpdate(), findOneAndRemove(), findOneAndUpdate(): Finds a single 
        document by id or criteria and either update or remove it. These are useful convenience 
        functions for updating and removing records.

Note: There is also a count() method that you can use to get the number of items that match conditions. 
This is useful if you want to perform a count without actually fetching the records.

--------------------------------------------
Working with related documents - population
--------------------------------------------
You can create references from one document/model instance to another using the ObjectId schema field, 
or from one document to many using an array of ObjectIds. The field stores the id of the related model. 
If you need the actual content of the associated document, you can use the populate() method in a query 
to replace the id with the actual data.

For example, the following schema defines authors and stories. Each author can have multiple stories, 
which we represent as an array of ObjectId. Each story can have a single author. The "ref" (highlighted 
in bold below) tells the schema which model can be assigned to this field.

    let mongoose = require('mongoose'),
        Schema = mongoose.Schema;

    let authorSchema = Schema({
        name: String,
        stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }]
    });

    let storySchema = Schema({
        author: { type: Schema.Types.ObjectId, ref: 'Author' },
        title: String
    });

    let Story = mongoose.model('Story', storySchema);
    let Author = mongoose.model('Author', authorSchema);

We can save our references to the related document by assigning the _id value. Below we create an 
author, then a book, and assign the author id to our stories author field.

    let bob = new Author({ name: 'Bob Smith' });

    bob.save((err) => {
        if (err) return handleError(err);

        // Bob now exists, so lets create a story
        let story = new Story({
            title: 'Bob goes sledding',
            author: bob._id     // assign the _id from the our author Bob. This ID is created by default
        });

        story.save((err) => {
            if (err) return handleError(err);
            // Bob now has his story
        });
    });

Our story document now has an author referenced by the author document's ID. In order to get the 
author information in our story results we use populate(), as shown below.

    Story
        .findOne({ title: 'Bob goes sledding' })
        .populate('author') // This populates the author id with actual author information!
        .exec((err, story) => {
            if (err) return handleError(err);
            console.log('The author is %s', story.author.name);
            // prints "The author is Bob Smith"
        });

Note: Astute readers will have noted that we added an author to our story, but we didn't do anything 
to add our story to our author's stories array. How then can we get all stories by a particular author? 
One way would be to add our author to the stories array, but this this would result in us having two 
places where the information relating authors and stories needs to be maintained.

A better way is to get the _id of our author, then use find() to search for this in the author field 
across all stories.

    Story
        .find({ author: bob._id })
        .exec((err, stories) => {
            if (err) return handleError(err);
            // return all stories that have Bob's id as their author
        });