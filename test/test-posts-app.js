const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();

const {BlogPost} = require('../models');

const {runServer, app, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);


function seedPostsData() {
	console.log('Seeding Posts Database Info');
	const seedData = [];
	for (let i=0; i<=10; i++) {
		seedData.push(createPostsData());
	}
	return BlogPost.insertMany(seedData);

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
	let date = randomDates[Math.floor(Math.random() * 
		randomDates.length)]
}

function createPostsData () {
	return {
		author: {
	    	firstName: "faker.author.firstName()",
	    	lastName: "faker.author.lastName()"
  	},
  		title: "faker.title()",
  		content: generateLoremIpsem(),
  		created: generateRandomDate()
	}
}

function dropDatabase() {
	console.log('Destoying database for reset!')
	return mongoose.connection.dropDatabase();
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
		return closeServer();
	});

	beforeEach(function() {
		return seedPostsData();
	});

	afterEach(function() {
		return dropDatabase();
	})

	describe('GET endpoint', function() {

		it('should return all of the 10 objects in the database', function() {
			let res;
			return chai.request(app)
			.get('/posts')
			.then(function(_res) {
				res = _res;
				res.should.have.status(200);
				res.body.should.have.length.of.at.least(1);
				return BlogPost.count();
			})
			.then(function(count) {
				res.body.should.have.length.of.at.least(count);
			});
		});

		let resPost;
		it('should have all the proper keys', function() {
			return chai.request(app)
			.get('/posts')
			.then(function(res) {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.have.length.of.at.least(1);
				res.body.forEach(function(post) {
					post.should.be.a('object');
					post.should.include.keys(
						'author', 'title', 'content', 'created');				
				});
				resPost = res.body[0];
				return BlogPost.findById(resPost.id);
			})
			.then(function(post) {
				resPost.id.should.equal(post.id);
				resPost.author.should.contain(post.author.firstName);
				resPost.content.should.equal(post.content);
				resPost.title.should.equal(post.title);
			});
		});
	});

	describe('POST endpoint', function() {
		//make a POST request
		//check that the restaurant has the right keys
		//check the id is there too

		it('should add a post to the db', function() {
			let newPost = createPostsData();

			return chai.request(app)
			.post('/posts')
			.send(newPost)
			.then(function(res) {
				res.should.have.status(201);
				res.should.be.json;
				res.body.should.include.keys(
					'author', 'title', 'content', 'created');
				res.body.id.should.not.be.null;
				return BlogPost.findById(res.body.id)
				.then(function(post) {
					post.author.firstName.should.equal(newPost.author.firstName);
					post.author.lastName.should.equal(newPost.author.lastName);
					post.content.should.equal(newPost.content);
					post.title.should.equal(newPost.title);
				});
			});
		});
	})

});