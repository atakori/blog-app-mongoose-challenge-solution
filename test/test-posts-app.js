const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();

const {blogPost} = require('../models');

const {runServer, app, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

/*author: {
    firstName: String,
    lastName: String
  },
  title: {type: String, required: true},
  content: {type: String},
  created: {type: Date, default: Date.now}*/

function seedPostsData() {
	console.log('Seeding Posts Database Info');
	const seedData = [];
	for (let i=0; i<=10; i++) {
		seedData.push(createPostsData());
	}
	return blogPost.insertMany(seedData);

}

function generateLoremIpsem() {
	return `Lorem ipsum dolor sit amet, consectetur adipiscing
	elit, sed do eiusmod tempor incididunt ut labore et dolore 
	magna aliqua. Ut enim ad minim veniam, quis nostrud 
	exercitation ullamco laboris nisi ut aliquip ex ea 
	commodo consequat. Duis aute irure dolor in reprehenderit in 
	voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
	Excepteur sint occaecat cupidatat non proident, sunt in culpa 
	qui officia deserunt mollit anim id est laborum.`
}

function generateRandomDate() {
	const randomDates = ["10/19/17", "04/08/99", "11/12/11", 
	"09/30/86", "12/15/01", "01/27/88"];
	let date = randomDates[math.floor(math.random() * 
		randomDates.length)]
}

function createPostsData () {
	return {
		author: {
	    	firstName: faker.author.firstName(),
	    	lastName: faker.author.lastName()
  	},
  		title: faker.title(),
  		content: generateLoremIpsem(),
  		created: generateRandomDate()
	}
}

function dropDatabase() {
	console.log('Destoying database for reset!')
	return mongoose.collection.db.dropDatabase();
}

describe('Posts API resource', function() {
	//runServer before each ALL tests
	//need to create new database before each test
	//need to tear down each database after each new test
	//closeServer before ALL tests
	before(function() {
		return runServer(TEST_DATABASE_URL);
	});

	after(function() {
		return closerServer();
	});

	beforeEach(function() {
		return seedPostsData();
	});

	afterEach(function() {
		return dropDatabase();
	});

}