import test from 'tape';
import {
  objList as list,
  getKeyVal,
  getKeyValItem
} from '../src/obj-list';
import data from './fixture';

const getData = () => JSON.parse(data);

test('getKeyVal', t => {
  t.deepEqual(getKeyVal('a', 1), {key: 'a', value: 1});
  t.deepEqual(getKeyVal(1), {key: 'id', value: 1});
  t.end();
});

test('getKeyValItem', t => {
  t.deepEqual(
    getKeyValItem({a: 1}, 'a', 1),
    {key: 'a', value: 1}
  );
  t.deepEqual(
    getKeyValItem({id: 1}, 1),
    {key: 'id', value: 1}
  );
  t.end();
});

test('getAll - 1 prop', t => {
  const data = getData();
  const ids = list.getAll(data, {
    common: 'abc'
  }).map(item => item.id);
  t.deepEqual(ids, [1, 3, 6]);
  t.end();
});

test('getAll - 2 props', t => {
  const data = getData();
  const ids = list.getAll(data, {
    common: 'abc',
    common2: 'def'
  }).map(item => item.id);
  t.deepEqual(ids, [1, 3]);
  t.end();
});

test('get - 2 props', t => {
  const data = getData();
  const person = list.get(data, {
    username: 'Samantha',
    email: 'Nathan@yesenia.net',
  });
  t.equal(person.id, 3);
  t.end();
});

test('get - 2 props error', t => {
  const data = getData();
  const person = list.get(data, {
    username: 'Samantha',
    email: 'scsd',
  });
  t.equal(person, undefined);
  t.end();
});

test('get', t => {
  const data = getData();
  const person = list.get(data, {username: 'Samantha'});
  t.equal(person.email, 'Nathan@yesenia.net');
  t.end();
});

test('get - partial', t => {
  const data = getData();
  const partial = list.get(data);
  t.equal(typeof partial, 'function');
  const person = partial({username: 'Samantha'});
  t.equal(person.email, 'Nathan@yesenia.net');
  t.end();
});

test('get - implicit id', t => {
  const data = getData();
  let person = list.get(data, 3);
  t.equal(person.username, 'Samantha');
  t.end();
});

test('get - implicit id - partial', t => {
  const data = getData();
  const partial = list.get(data);
  const person = partial(3)
  t.equal(person.username, 'Samantha');
  t.end();
});

test('replace', t => {
  const data = getData();
  const person = list.get(data, {username: 'Karianne'});
  person.username = 'newusername';
  list.replace(data, person);
  t.equal(data[3].username, 'newusername');
  t.end();
});

test('replace - partial', t => {
  const data = getData();
  const partial = list.replace(data);
  t.equal(typeof partial, 'function');

  const person = list.get(data, {username: 'Karianne'});
  person.username = 'newusername';
  partial(person);
  t.equal(data[3].username, 'newusername');
  t.end();
});

test('replace - implicit id', t => {
  const data = getData();
  const person = list.get(data, 4);
  person.username = 'newusername';
  list.replace(data, person);
  t.equal(data[3].username, 'newusername');
  t.end();
});

test('replace - implicit id - partial', t => {
  const data = getData();
  const partial = list.replace(data);
  const person = list.get(data, 4);
  person.username = 'newusername';
  partial(person);
  t.equal(data[3].username, 'newusername');
  t.end();
});

test('remove', t => {
  const data = getData();
  list.remove(data,  'username', 'Samantha');
  t.equal(data.length, 9);
  t.equal(list.get(data, 3), undefined);
  t.end();
});

test('remove - partial', t => {
  const data = getData();
  const partial = list.remove(data);
  t.equal(typeof partial, 'function');
  partial('username', 'Samantha');
  t.equal(data.length, 9);
  t.equal(list.get(data, 3), undefined);
  t.end();
});

test('remove - implicit id', t => {
  const data = getData();
  list.remove(data, 3);
  t.equal(data.length, 9);
  t.equal(list.get(data, 3), undefined);
  t.end();
});

test('remove - implicit id - partial', t => {
  const data = getData();
  const partial = list.remove(data);
  partial(3);
  t.equal(data.length, 9);
  t.equal(list.get(data, 3), undefined);
  t.end();
});

test('removeProps', t => {
  const data = getData();
  list.removeProps(data, ['username', 'email'], 'username', 'Karianne');
  t.ok(!Object.keys(data[3]).includes('username'));
  t.ok(!Object.keys(data[3]).includes('email'));
  t.end();
});

test('removeProps - partial', t => {
  const data = getData();
  const partial = list.removeProps(data);
  partial(['username', 'email'], 'username', 'Karianne');
  t.ok(!Object.keys(data[3]).includes('username'));
  t.ok(!Object.keys(data[3]).includes('email'));
  t.end();
});

test('update', t => {
  const data = getData();
  const person = list.get(data, {username: 'Karianne'});
  person.username = 'newusername';
  list.update(data, person);
  t.equal(data[3].username, 'newusername');
  t.end();
});

test('update - partial', t => {
  const data = getData();
  const partial = list.update(data);
  t.equal(typeof partial, 'function');
  const person = list.get(data, {username: 'Karianne'});
  person.username = 'newusername';
  partial(person);
  t.equal(data[3].username, 'newusername');
  t.end();
});

test('update - implicit id', t => {
  const data = getData();
  const person =  list.get(data, 4);
  person.username = 'newusername';
  list.update(data, person);
  t.equal(data[3].username, 'newusername');
  t.end();
});

test('update - implicit id - partial', t => {
  const data = getData();
  const partial = list.update(data);
  const person =  list.get(data, 4);
  person.username = 'newusername';
  partial(data, person);
  t.equal(data[3].username, 'newusername');
  t.end();
});

test('updateProperties', t => {
  const data = getData();
  const result = list.updateProperties(data, {username: 'newusername'}, 'username', 'Karianne');
  t.equal(result[3].id, 4);
  t.equal(result[3].username, 'newusername');
  t.end();
});

test('add', t => {
  const data = getData();
  list.add(data, {id: 100, username: 'newusername'}, 'id');
  t.equal(data.length, 11);
  t.equal(data[data.length - 1].id, 100);
  t.end();
});

test('add - partial', t => {
  const data = getData();
  const partial = list.add(data);
  partial({id: 100, username: 'newusername'}, 'id');
  t.equal(data.length, 11);
  t.equal(data[data.length - 1].id, 100);
  t.end();
});
