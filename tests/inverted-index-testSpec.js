import newIndex from '../src/inverted-index';

describe('Inverted Index Tests', () => {
  describe('Validate data', () => {
    const allfiles = ['invalid-file.json', 'invalidFile.json',
      'not-json-array.json', 'empty-book.json', 'bad-format.json'];

    const newInvertedIndex = new newIndex();
    newInvertedIndex.createIndex(newInvertedIndex.readBookData(allfiles));

    it('Should throw invalid file for invaild file or filename', () => {
      expect(newInvertedIndex.errors[0].errorMessage)
      .toBe('Invalid file');
      expect(newInvertedIndex.errors[1].errorMessage)
      .toBe('Invalid file');
    });

    it('Should give error if file is not a JSON Array', () => {
      expect(newInvertedIndex.errors[2].errorMessage)
      .toBe('file is not a JSON array');
    });

    it('Should give error if JSON Object is empty or contain empty objects', () => {
      expect(newInvertedIndex.errors[3].errorMessage)
      .toBe('JSON object cannot be empty or contain empty objects');
    });

    it('Should throw aapropriate error if JSON Object is malformed', () => {
      expect(newInvertedIndex.errors[4].errorMessage)
      .toBe('Bad JSON Array format');
    });
  });

  describe('Read Book Data', () => {
    const newInvertedIndex = new newIndex();
    const allfiles = ['book-three.json'];
    const readfile = newInvertedIndex.readBookData(allfiles);
    for (const currentFile of readfile) {
      it('should ensure that the file passed is read and yielded', () => {
        expect(currentFile.filename).toBe('book-three.json');
        expect(typeof currentFile.fileContent).toBe('object');
      });
    }
  });

  describe('Create Index', () => {
    const newInvertedIndex = new newIndex();
    const allfiles = ['book-one.json', 'book-two.json', 'book-three.json'];
    newInvertedIndex.createIndex(newInvertedIndex.readBookData(allfiles));

    it('should be able to create index for multiple files', () => {
      expect(newInvertedIndex.createdIndex['book-one.json']
      .understand).toEqual([0, 1]);
      expect(newInvertedIndex.createdIndex['book-two.json']
      .world).toEqual([0, 1, 2]);
      expect(newInvertedIndex.createdIndex['book-three.json']
      .around).toEqual([0]);
    });
  });

  describe('take in search query', () => {
    const newInvertedIndex = new newIndex();
    const searchQuery = ['first string', 'around', ['world', 'remincense']];
    const allQuery = newInvertedIndex.tokenizeSearchQuery(searchQuery);

    const allUniqueQuery = [];
    for (const individualQuery of allQuery) {
      allUniqueQuery.push(individualQuery);
    }
    it('should work with search query in varying formats', () => {
      expect(allUniqueQuery).toEqual(['first', 'string', 'around', 'world', 'remincense']);
    });
  });

  describe('Search Index', () => {
    it('Should function when filename argument is not supplied', () => {
      const newInvertedIndex = new newIndex(),
        allfiles = ['book-one.json', 'book-two.json', 'book-three.json'],
        processedFileObject = newInvertedIndex.readBookData(allfiles),
        index = newInvertedIndex.createdIndex,
        searchQuery = ['first string', 'around', ['world', 'reminscence']];

      newInvertedIndex.createIndex(processedFileObject);
      newInvertedIndex.searchIndex(index, searchQuery);

      expect(newInvertedIndex.searchResult['book-one.json'])
      .toEqual({ string: [0, 1] });
      expect(newInvertedIndex.searchResult['book-two.json'])
      .toEqual({ first: [0, 1, 2], string: [0, 1, 2], world: [0, 1, 2] });
      expect(newInvertedIndex.searchResult['book-three.json'])
      .toEqual({ around: [0], world: [0], reminscence: [0] });
    });

    it('Should only return result for file containing search query', () => {
      const newInvertedIndex = new newIndex(),
        allfiles = ['book-one.json', 'book-two.json', 'book-three.json'],
        processedFileObject = newInvertedIndex.readBookData(allfiles),
        index = newInvertedIndex.createdIndex,
        searchQuery = ['first reminscence', 'around', ['world', 'around', 'remint']];

      newInvertedIndex.createIndex(processedFileObject);
      newInvertedIndex.searchIndex(index, searchQuery);

      expect(newInvertedIndex.searchResult['book-one.json'])
      .toBeUndefined();
      expect(newInvertedIndex.searchResult['book-two.json'])
      .toEqual({ first: [0, 1, 2], world: [0, 1, 2] });
      expect(newInvertedIndex.searchResult['book-three.json'])
      .toEqual({ around: [0], world: [0], reminscence: [0] });
    });

    it('should filter search by filename if filename argument is supplied', () => {
      const newInvertedIndex = new newIndex(),
        allfiles = ['book-one.json', 'book-two.json', 'book-three.json'],
        processedFileObject = newInvertedIndex.readBookData(allfiles),
        index = newInvertedIndex.createdIndex,
        filename = ['book-one.json', 'book-three.json'],
        searchQuery = ['first string', 'around', ['world', 'reminscence']];

      newInvertedIndex.createIndex(processedFileObject);
      newInvertedIndex.searchIndex(index, filename, searchQuery);

      expect(newInvertedIndex.searchResult['book-one.json'])
      .toEqual({ string: [0, 1] });
      expect(newInvertedIndex.searchResult['book-two.json'])
      .toBeUndefined();
      expect(newInvertedIndex.searchResult['book-three.json'])
      .toEqual({ around: [0], world: [0], reminscence: [0] });
    });

    it('should return searh query not found when search query returns no match', () => {
      const newInvertedIndex = new newIndex(),
        allfiles = ['book-one.json', 'book-two.json', 'book-three.json'],
        processedFileObject = newInvertedIndex.readBookData(allfiles),
        index = newInvertedIndex.createdIndex,
        filename = ['book-one.json', 'book-three.json'],
        searchQuery = ['accolade indistinct', 'remint'];

      newInvertedIndex.createIndex(processedFileObject);
      newInvertedIndex.searchIndex(index, filename, searchQuery);

      expect(newInvertedIndex.searchResult).toEqual('Search Query Not Found');
    });
  });

  describe('Multiple index searching', () => {
    const newInvertedIndex = new newIndex();
    const allfiles = ['book-one.json', 'book-two.json', 'book-three.json'];
    const processedFileObject = newInvertedIndex.readBookData(allfiles);
    newInvertedIndex.createIndex(processedFileObject);

    it('should allow varied multiple searches from the same created index', () => {
      const index = newInvertedIndex.createdIndex;
      const searchQuery = ['first string', 'around', ['world', 'reminscence']];
      newInvertedIndex.searchIndex(index, searchQuery);

      expect(newInvertedIndex.searchResult['book-one.json'])
      .toEqual({ string: [0, 1] });
      expect(newInvertedIndex.searchResult['book-two.json'])
      .toEqual({ first: [0, 1, 2], string: [0, 1, 2], world: [0, 1, 2] });
      expect(newInvertedIndex.searchResult['book-three.json'])
      .toEqual({ around: [0], world: [0], reminscence: [0] });
    });

    it('should also allow more search of the same created index', () => {
      const index = newInvertedIndex.createdIndex;
      const searchQuery = ['inquiry', ['obama', 'understand']];
      newInvertedIndex.searchIndex(index, searchQuery);

      expect(newInvertedIndex.searchResult['book-one.json'])
      .toEqual({ inquiry: [0], obama: [1], understand: [0, 1] });
      expect(newInvertedIndex.searchResult['book-two.json'])
      .toEqual({ understand: [0, 1, 2] });
      expect(newInvertedIndex.searchResult['book-three.json'])
      .toBeUndefined();
    });

    it('should allow optional use of filename argument to search the same index', () => {
      const index = newInvertedIndex.createdIndex;
      const searchQuery = ['inquiry', 'around', ['obama', 'understand']];
      const filename = ['book-two.json', 'book-three.json'];
      newInvertedIndex.searchIndex(index, filename, searchQuery);

      expect(newInvertedIndex.searchResult['book-one.json'])
      .toBeUndefined();
      expect(newInvertedIndex.searchResult['book-two.json'])
      .toEqual({ understand: [0, 1, 2] });
      expect(newInvertedIndex.searchResult['book-three.json'])
      .toEqual({ around: [0] });
    });

    it('mix of cases, symbols, tab and multiple spacing should not break code', () => {
      const index = newInvertedIndex.createdIndex;
      const searchQuery = ['inQU#iry',   'aro##&^und',    ['obAMa', 'understand']];
      newInvertedIndex.searchIndex(index, searchQuery);

      expect(newInvertedIndex.searchResult['book-one.json'])
      .toEqual({ inquiry: [0], obama: [1], understand: [0, 1] });
      expect(newInvertedIndex.searchResult['book-two.json'])
      .toEqual({ understand: [0, 1, 2] });
      expect(newInvertedIndex.searchResult['book-three.json'])
      .toEqual({ around: [0] });
    });

    it('should allow searching for javascript reserved words', () => {
      const index = newInvertedIndex.createdIndex;
      const searchQuery = ['toString'];
      const filename = ['book-three.json'];
      newInvertedIndex.searchIndex(index, filename, searchQuery);

      expect(newInvertedIndex.searchResult['book-one.json']).toBeUndefined();
      expect(newInvertedIndex.searchResult['book-two.json']).toBeUndefined();
      expect(newInvertedIndex.searchResult['book-three.json']).toEqual({ tostring: [0] });
    });
  });

  describe('Sanitize data', () => {
    const newInvertedIndex = new newIndex();
    const searchQuery = ['fi%$rst str#&#ing', 'ar/+-ound', ['world',    'remincense']];
    const allQuery = newInvertedIndex.tokenizeSearchQuery(searchQuery);

    const allUniqueQuery = [];
    for (const individualQuery of allQuery) {
      allUniqueQuery.push(individualQuery);
    }
    it('split on whitespaces and tabs, and filter out symbols from text', () => {
      expect(allUniqueQuery)
      .toEqual(['first', 'string', 'around', 'world', 'remincense']);
    });
  });

  describe('Other testcases [preventing code breaking]', () => {
    const newInvertedIndex = new newIndex(),
      allfiles = ['book-one.json', 'invalid-file.json', 'empty-book.json'];
    newInvertedIndex.createIndex(newInvertedIndex.readBookData(allfiles));

    it('mix of valid and invalid files should not break code', () => {
      expect(newInvertedIndex.createdIndex['book-one.json'].understand).toEqual([0, 1]);
      expect(newInvertedIndex.createdIndex['invalid-file.json']).toBeUndefined();
      expect(newInvertedIndex.createdIndex['empty-book.json']).toBeUndefined();
    });

    it('should report the appropriate errors for the invalid files', () => {
      expect(newInvertedIndex.errors[0].errorMessage)
      .toBe('Invalid file');
      expect(newInvertedIndex.errors[1].errorMessage)
      .toBe('JSON object cannot be empty or contain empty objects');
    });
  });
});
