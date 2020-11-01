
const mongoose = require('mongoose');

const hotlineSchema = new mongoose.Schema({
    organisation_name: {
        type: String,
        required: true, 
	},
	country: {
        type: String,
        required: true, 
	},
	city: {
        type: String,
        required: true, 
        
	},

	phone: {
        type: String,
        required: true, 
        
	},
}, {collection: 'hotlines'});

module.exports = mongoose.model('hotlines', hotlineSchema);