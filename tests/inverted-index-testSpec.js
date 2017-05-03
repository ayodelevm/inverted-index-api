/* eslint linebreak-style: ["error", "windows"]*/
import newIndex from '../dist/inverted-index';

describe('Inverted Index Tests', () => {
  describe('Validate data', () => {
    const newInvertedIndex = new newIndex();
    const allfiles = ['invalid-file.json', 'invalidFile.json', 'not-json-array.json', 'empty-book.json', 'bad-format.json'];
    newInvertedIndex.createIndex(newInvertedIndex.readBookData(allfiles));

    it('Should throw aapropriate error if file is not a JSON a valid file or if file is not found', () => {
      expect(newInvertedIndex.errors[0].message).toBe('Invalid file');
      expect(newInvertedIndex.errors[1].message).toBe('Invalid file');
    });

    it('Should throw aapropriate error if file is not a JSON Array', () => {
      expect(newInvertedIndex.errors[2].message).toBe('file is not a JSON array');
    });

    it('Should throw appropriate error if JSON Object is empty or contain empty objects', () => {
      expect(newInvertedIndex.errors[3].message).toBe('JSON object cannot be empty or contain empty objects');
    });

    it("Should throw aapropriate error if JSON Object is not in the format of `{title: 'a', text: 'b'}`", () => {
      expect(newInvertedIndex.errors[4].message).toBe('Bad JSON Array format');
    });
  });

  describe('Read Book Data', () => {
    const newInvertedIndex = new newIndex();
    const allfiles = ['book-three.json'];
    const readfile = newInvertedIndex.readBookData(allfiles);
    for (const currentFile of readfile) {
      it('should ensure that the file passed in is read and yielded in the right format', () => {
        expect(currentFile.filename).toBe('book-three.json');
        expect(typeof currentFile.fileContent).toBe('object');
      });
    }
  });

  describe('Create Index', () => {
    const newInvertedIndex = new newIndex();
    const allfiles = ['book-one.json', 'book-two.json', 'book-three.json'];
    newInvertedIndex.createIndex(newInvertedIndex.readBookData(allfiles));

    it('should be able to create index for multiple files and map the created index to the right file', () => {
      expect(newInvertedIndex.createdIndex['book-one.json'].understand).toEqual([0, 1]);
      expect(newInvertedIndex.createdIndex['book-two.json'].world).toEqual([0, 1, 2]);
      expect(newInvertedIndex.createdIndex['book-three.json'].around).toEqual([0]);
    });
  });

  describe('take in search query', () => {
    const newInvertedIndex = new newIndex();
    const searchQuery = ['first string', 'around', ['world', 'remincense']];
    const allQuery = newInvertedIndex.takeInSearchQuery(searchQuery);

    const allUniqueQuery = [];
    for (const individualQuery of allQuery) {
      allUniqueQuery.push(individualQuery);
    }
    it('should take search query in varying formats and yeild one word at a time to the search index method', () => {
      expect(allUniqueQuery).toEqual(['first', 'string', 'around', 'world', 'remincense']);
    });
  });

  describe('Search Index', () => {
    const newInvertedIndex = new newIndex();
    const allfiles = ['book-one.json', 'book-two.json', 'book-three.json'];
    const searchQuery = ['first string', 'around', ['world', 'reminscence']];
    newInvertedIndex.createIndex(newInvertedIndex.readBookData(allfiles));
    newInvertedIndex.searchIndex(newInvertedIndex.takeInSearchQuery(searchQuery));

    it('Should be able to search through indexes for multiple files and return the word with index and the file it was found', () => {
      expect(newInvertedIndex.searchResult['book-one.json']).toEqual({ string: [0, 1] });
      expect(newInvertedIndex.searchResult['book-two.json']).toEqual({ first: [0, 1, 2], string: [0, 1, 2], world: [0, 1, 2] });
      expect(newInvertedIndex.searchResult['book-three.json']).toEqual({ around: [0], world: [0], reminscence: [0] });
    });
  });

  describe('Search Index 2', () => {
    const newInvertedIndex = new newIndex();
    const allfiles = ['book-one.json', 'book-two.json', 'book-three.json'];
    const searchQuery = ['first reminscence', 'around', ['world', 'around', 'remint']];
    newInvertedIndex.createIndex(newInvertedIndex.readBookData(allfiles));
    newInvertedIndex.searchIndex(newInvertedIndex.takeInSearchQuery(searchQuery));

    it(`Should not return an indexed file if non of the search query is found in that file, 
      should return only one word for multiple word occurence and should ignore word not found`, () => {
      expect(newInvertedIndex.searchResult['book-one.json']).toBeUndefined();
      expect(newInvertedIndex.searchResult['book-two.json']).toEqual({ first: [0, 1, 2], world: [0, 1, 2] });
      expect(newInvertedIndex.searchResult['book-three.json']).toEqual({ around: [0], world: [0], reminscence: [0] });
    });
  });

  describe('Sanitize data', () => {
    const newInvertedIndex = new newIndex();
    const searchQuery = ['fi%$rst str#&#ing', 'ar/+-ound', ['world',    'remincense']];
    const allQuery = newInvertedIndex.takeInSearchQuery(searchQuery);

    const allUniqueQuery = [];
    for (const individualQuery of allQuery) {
      allUniqueQuery.push(individualQuery);
    }
    it(`Should split on whitespaces[single or multiple] and tabs, and filter out symbols 
    from text whenever sanitize data is called in a method`, () => {
      expect(allUniqueQuery).toEqual(['first', 'string', 'around', 'world', 'remincense']);
    });
  });

  describe('Other testcases [preventing code breaking]', () => {
    const newInvertedIndex = new newIndex();
    const allfiles = ['book-one.json', 'invalid-file.json', 'empty-book.json', 'book-three.json'];
    newInvertedIndex.createIndex(newInvertedIndex.readBookData(allfiles));

    it(`should not break the code when an invalid file or file with wrong content is mixed with valid files. 
      The valid files should run and the invalid ones should report an error`, () => {
      expect(newInvertedIndex.createdIndex['book-one.json'].understand).toEqual([0, 1]);
      expect(newInvertedIndex.createdIndex['invalid-file.json']).toBeUndefined();
      expect(newInvertedIndex.createdIndex['empty-book.json']).toBeUndefined();
      expect(newInvertedIndex.createdIndex['book-three.json'].around).toEqual([0]);
    });

    it('should report the appropriate errors for the invalid files', () => {
      expect(newInvertedIndex.errors[0].message).toBe('Invalid file');
      expect(newInvertedIndex.errors[1].message).toBe('JSON object cannot be empty or contain empty objects');
    });
  });
});
