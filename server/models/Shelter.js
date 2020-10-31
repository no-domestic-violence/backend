
const mongoose = require('mongoose');

const shelterSchema = new mongoose.Schema({
    latitude: {
		type: Number,
	},
	longitude: {
		type: Number,
	},
	place_name: {
		type: String,
	},
	description: {
		type: String,
	},
	description: {
		type: String,
	},
	address: {
		type: String,
	},
	contact_person: {
		type: String,
	},
	phone: {
		type: String,
	},
	loc: {
		type: { type: String },
		coordinates: [Number],
    },
}, {collection: 'shelters'});

module.exports = mongoose.model('shelters', shelterSchema);
