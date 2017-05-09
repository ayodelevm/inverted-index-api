import supertest from 'supertest';
import server from '../app';

const api = supertest(server);

describe('create route', () => {
  it('responds with the right status message', (done) => {
    api.post('/api/create')
      .attach('allFiles', './fixtures/book-one.json')
      .attach('allFiles', './fixtures/book-two.json')
      .end((err, res) => {
        expect(res.status).toEqual(200);
        done(err);
      });
  });

  it('response body should be an object', (done) => {
    api.post('/api/create')
      .attach('allFiles', './fixtures/book-one.json')
      .end((err, res) => {
        expect(typeof res.body).toEqual('object');
        done();
      });
  });

  it('created index should be of type object', (done) => {
    api.post('/api/create')
      .attach('allFiles', './fixtures/book-one.json')
      .end((err, res) => {
        expect(typeof res.body.processedFiles).toEqual('object');
        done();
      });
  });

  it('error messages should be stored in an array', (done) => {
    api.post('/api/create')
      .attach('allFiles', './fixtures/book-one.json')
      .end((err, res) => {
        expect(Array.isArray(res.body.fileErrors)).toBeTruthy();
        done();
      });
  });

  it('generate error for invalid file and create index for valid file', (done) => {
    api.post('/api/create')
      .attach('allFiles', './fixtures/book-one.json')
      .attach('allFiles', './fixtures/bad-format.json')
      .attach('allFiles', './fixtures/invalid-file.json')
      .end((err, res) => {
        expect(res.body.fileErrors[0].errorMessage)
        .toEqual('Bad JSON Array format');
        expect(res.body.processedFiles['book-one.json']).toBeDefined();
        done();
      });
  });
});

describe('search route', () => {
  it('give staus error 500 when upload is done in search endpoint', (done) => {
    api.post('/api/search')
      .attach('allFiles', './fixtures/book-one.json')
      .send({
        searchTerms: ['toString', 'world'],
        fileName: ['book-three.json', 'book-two.json']
      })
      .end((err, res) => {
        expect(res.status).toEqual(500);
        done(err);
      });
  });

  it('allow search when valid and invalid file are uploaded together', (done) => {
    api.post('/api/create')
      .attach('allFiles', './fixtures/book-one.json')
      .attach('allFiles', './fixtures/book-two.json')
      .attach('allFiles', './fixtures/bad-format.json')
      .end(() => {
        api.post('/api/search')
        .send({
          searchTerms: ['toString', 'world'],
          fileName: ['book-three.json', 'book-two.json']
        })
        .end((err, res) => {
          expect(res.status).toEqual(200);
          done(err);
        });
      });
  });

  it('allow search when filename argument is supplied', (done) => {
    api.post('/api/create')
      .attach('allFiles', './fixtures/book-one.json')
      .attach('allFiles', './fixtures/book-two.json')
      .attach('allFiles', './fixtures/bad-format.json')
      .end(() => {
        api.post('/api/search')
        .send({
          searchTerms: ['understand', 'world'],
          fileName: ['book-one.json', 'book-three.json']
        })
        .end((err, res) => {
          expect(res.status).toEqual(200);
          done(err);
        });
      });
  });


  it('should allow search when filename argument is not supplied', (done) => {
    api.post('/api/create')
      .attach('allFiles', './fixtures/book-one.json')
      .attach('allFiles', './fixtures/book-two.json')
      .attach('allFiles', './fixtures/book-three.json')
      .end(() => {
        api.post('/api/search')
        .send({
          searchTerms: ['toString', 'world', 'around']
        })
        .end((err, res) => {
          expect(res.status).toEqual(200);
          done(err);
        });
      });
  });

  it('should return search query not found when no word is found', (done) => {
    api.post('/api/create')
      .attach('allFiles', './fixtures/book-one.json')
      .attach('allFiles', './fixtures/book-two.json')
      .attach('allFiles', './fixtures/book-three.json')
      .end(() => {
        api.post('/api/search')
        .send({
          searchTerms: ['remee']
        })
        .end((err, res) => {
          expect(res.body).toEqual('Search Query Not Found');
          done(err);
        });
      });
  });
});


