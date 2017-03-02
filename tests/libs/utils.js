import assert from 'assert';
import _ from 'lodash';
import {
  describe,
  it
} from 'mocha';

import * as utils from '../../src/libs/utils';

describe('Utils tests', () =>  {

  describe('IsEmpty tests', () =>  {
    it('Should not be empty - Object', (done) =>  {
      const obj = {
        'test': 'test'
      };
      assert(!utils.isEmpty(obj));
      done();
    });
    it('Should not be empty - Array', (done) =>  {
      const obj = ['moo'];
      assert(!utils.isEmpty(obj));
      done();
    });
    it('Should not be empty - String', (done) =>  {
      const obj = 'moo';
      assert(!utils.isEmpty(obj));
      done();
    });
    it('Should be empty - Object', (done) =>  {
      const obj = {};
      assert(utils.isEmpty(obj));
      done();
    });
    it('Should be empty - False', (done) =>  {
      const obj = false;
      assert(utils.isEmpty(obj));
      done();
    });
    it('Should be empty - Null', (done) =>  {
      const obj = null;
      assert(utils.isEmpty(obj));
      done();
    });
    it('Should be empty - Array', (done) =>  {
      const obj = [];
      assert(utils.isEmpty(obj));
      done();
    });
  });
  
  describe('Sort object tests', () =>  {
    it('Should create a sort object from blank', (done) =>  {
      const obj = {};
      const ret = utils.generateSortObject(obj);
      assert(ret.hasOwnProperty('start'));
      assert(ret.start === 0);
      assert(ret.hasOwnProperty('count'));
      assert(ret.count === 5);
      assert(ret.hasOwnProperty('sortCol'));
      assert(ret.sortCol === 'Id');
      assert(ret.hasOwnProperty('sortDir'));
      assert(ret.sortDir === 'DESC');
      done();
    });
    it('Should create a sort object from passed in params', (done) =>  {
      const obj = {
        count: 10,
        start: 3,
        sortCol: 'Col',
        sortDir: 'ASC'
      };
      const ret = utils.generateSortObject(obj);
      assert(ret.hasOwnProperty('start'));
      assert(ret.start === 3);
      assert(ret.hasOwnProperty('count'));
      assert(ret.count === 10);
      assert(ret.hasOwnProperty('sortCol'));
      assert(ret.sortCol === 'Col');
      assert(ret.hasOwnProperty('sortDir'));
      assert(ret.sortDir === 'ASC');
      done();
    });
  });

  describe('Sanitize tests', () =>  {
    it('Should sanitize', (done) =>  {
      const dirty1 = '<p><script src="badscript.js"></script>Idk, my bff Jill? &amp;</p>';
      const expected1 = 'Idk, my bff Jill? &';

      const dirty2 = '<p>BBC Option C. Down Pay $399 ch# 1266 &amp; 1st Month $138.37 ch# 1267 paid onn 10/21/2013.&nbsp;</p>';
      const expected2 = 'BBC Option C. Down Pay $399 ch# 1266 & 1st Month $138.37 ch# 1267 paid onn 10/21/2013. ';

      const result1 = utils.sanitizeString(dirty1);
      const result2 = utils.sanitizeString(dirty2);

      assert(result1 === expected1, 'Result 1 was ' + result1);
      assert(result2 === expected2, 'Result 2 was ' + result2);

      done();
    });
  });
  describe('Sort keys test', () =>  {
    it('Should sort an object by keys', (done) =>  {
      const input = {
        z: 5,
        a: 1,
        c: 3,
        b: 2
      };
      const expected = {
        a: 1,
        b: 2,
        c: 3,
        z: 5
      };
      assert(_.isEqual(input, expected));
      done();
    });
  });

  describe('Capitalize first letter', () => {
    it('Should capitalize the first letter', (done) => {
      assert.equal(utils.capFirstLetter(''), '');
      assert.equal(utils.capFirstLetter('a'), 'A');
      assert.equal(utils.capFirstLetter('moo'), 'Moo');
      done();
    });
  });
});