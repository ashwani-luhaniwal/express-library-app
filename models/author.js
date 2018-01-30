const mongoose = require('mongoose');
const moment = require('moment');   // For date handling

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
    first_name: {type: String, required: true, max: 100},
    family_name: {type: String, required: true, max: 100},
    date_of_birth: {type: Date},
    date_of_death: {type: Date},
});

// Virtual for author 'full' name
AuthorSchema.virtual('name').get(() => {
    return this.family_name + ', ' + this.first_name;
});

// Virtual for this author instance URL
AuthorSchema.virtual('url').get(() => {
    return '/catalog/author/' + this._id;
});

AuthorSchema.virtual('lifespan').get(() => {
    let lifetime_string = '';
    if (this.date_of_birth) {
        lifetime_string = moment(this.date_of_birth).format('MMMM Do, YYYY');
    }
    lifetime_string += ' - ';
    if (this.date_of_death) {
        lifetime_string += moment(this.date_of_death).format('MMMM Do, YYYY');
    }
    return lifetime_string;
});

AuthorSchema.virtual('date_of_birth_yyyy_mm_dd').get(() => {
    return moment(this.date_of_birth).format('YYYY-MM-DD');
});

AuthorSchema.virtual('date_of_death_yyyy_mm_dd').get(() => {
    return moment(this.date_of_death).format('YYYY-MM-DD');
});

// Export model
module.exports = mongoose.model('Author', AuthorSchema);