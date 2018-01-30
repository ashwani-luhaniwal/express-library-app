const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * ----------------------
 * Schema types (fields)
 * ----------------------
 * A schema can have an arbitrary number of fields — each one represents a field in the documents 
 * stored in MongoDB.
 * 
 * Most of the SchemaTypes (the descriptors after “type:” or after field names) are self explanatory. 
 * The exceptions are:
 *      - ObjectId: Represents specific instances of a model in the database. For example, a book might 
 *          use this to represent its author object. This will actually contain the unique ID (_id) 
 *          for the specified object. We can use the populate() method to pull in the associated 
 *          information when needed.
 *      - Mixed: An arbitrary schema type.
 *      - []: An array of items. You can perform JavaScript array operations on these models (push, 
 *          pop, unshift, etc.).
 * 
 * -----------
 * Validation
 * -----------
 * Mongoose provides built-in and custom validators, and synchronous and asynchronous validators. It 
 * allows you to specify both the acceptable range or values and the error message for validation 
 * failure in all cases.
 * 
 * The built-in validators include:
 *      - All SchemaTypes have the built-in 'required' validator. This is used to specify whether the 
 *          field must be supplied in order to save a document.
 *      - Numbers have 'min' and 'max' validators.
 *      - Strings have:
 *          enum: specifies the set of allowed values for the field.
 *          match: specifies a regular expression that the string must match.
 *          maxlength and minlength for the string.
 */
const BookSchema = new Schema({
    title: {type: String, required: true},
    author: {type: Schema.ObjectId, ref: 'Author', required: true},
    summary: {type: String, required: true},
    isbn: {type: String, required: true},
    genre: [{type: Schema.ObjectId, ref: 'Genre'}]
});

/**
 * -------------------
 * Virtual Properties
 * -------------------
 * Virtual properties are document properties that you can get and set but that do not get persisted 
 * to MongoDB. The getters are useful for formatting or combining fields, while setters are useful for 
 * de-composing a single value into multiple values for storage. The example in the documentation 
 * constructs (and deconstructs) a full name virtual property from a first and last name field, which 
 * is easier and cleaner than constructing a full name every time one is used in a template.
 * 
 * Note: We will use a virtual property in the library to define a unique URL for each model record 
 * using a path and the record's _id value.
 */
// Virtual for this book instance URL
BookSchema.virtual('url').get(() => {
    return '/catalog/book/' + this._id;
});

// Export model
// Compile model from Schema
/**
 * The first argument is the singular name of the collection that will be created for your model 
 * (Mongoose will create the database collection for the below model 'Book'), and the second argument 
 * is the schema you want to use in creating the model.
 */
module.exports = mongoose.model('Book', BookSchema);