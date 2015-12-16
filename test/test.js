require('must');
var request = require('supertest-as-promised');
//var config = require('../lib/config');
var app = require('../server/app');

describe("Index", function() {
    it("provides a favicon.ico", function() {
        return request(app).get('/favicon.ico')
            .expect(200)
            .expect('Content-Type', 'image/x-icon');
    });
    it("have to exist", function() {
        return request(app).get('/')
            .expect(200)
            .then(function(res) {
                res.must.exist();
                res.text.must.contain('gwendoux.com');
            });
    });
});

describe("API feed", function() {
    it("must return links", function() {
        this.timeout(5000);
        return request(app).get('/api/feed')
            .expect('Content-Type', 'text/plain')
            .expect(200)
            .then(function(res) {
                res.must.exist();
                res.text.must.not.be.empty();
            });
    });
});

describe("API photos", function() {
    it("must return at least 1 result", function() {
        return request(app).get('/api/photos/coffeeoftheday')
            .expect('Content-Type', 'text/plain')
            .expect(200)
            .then(function(res) {
                res.must.exist();
                res.text.must.not.be.empty();
            });
    });
});
