import test from 'ava';
import * as query from '../../lib/utils/query';

test('Should throw an error if the value is undefined', t => {
	t.throws(query.parse.bind(query, {id: undefined}), 'Value for key `id` is undefined. Please provide a valid value.');
});

test('Should throw an error if the value of a sub property is undefined', t => {
	t.throws(query.parse.bind(query, {foo: {$gt: undefined}}), 'Value for key `foo` is undefined. Please provide a valid value.');
});

test('Should parse an object with one object', t => {
	const result = query.parse({id: 5});

	t.is(result.ConditionExpression, '#k_id=:v_id');
	t.deepEqual(result.ExpressionAttributeNames, {'#k_id': 'id'});
	t.deepEqual(result.ExpressionAttributeValues, {':v_id': 5});
});

test('$eq', t => {
	const result = query.parse({id: {$eq: 5}});

	t.is(result.ConditionExpression, '#k_id=:v_id');
	t.deepEqual(result.ExpressionAttributeNames, {'#k_id': 'id'});
	t.deepEqual(result.ExpressionAttributeValues, {':v_id': 5});
});

test('$gt', t => {
	const result = query.parse({id: {$gt: 5}});

	t.is(result.ConditionExpression, '#k_id>:v_id');
	t.deepEqual(result.ExpressionAttributeNames, {'#k_id': 'id'});
	t.deepEqual(result.ExpressionAttributeValues, {':v_id': 5});
});

test('$gte', t => {
	const result = query.parse({id: {$gte: 5}});

	t.is(result.ConditionExpression, '#k_id>=:v_id');
	t.deepEqual(result.ExpressionAttributeNames, {'#k_id': 'id'});
	t.deepEqual(result.ExpressionAttributeValues, {':v_id': 5});
});

test('$lt', t => {
	const result = query.parse({id: {$lt: 5}});

	t.is(result.ConditionExpression, '#k_id<:v_id');
	t.deepEqual(result.ExpressionAttributeNames, {'#k_id': 'id'});
	t.deepEqual(result.ExpressionAttributeValues, {':v_id': 5});
});

test('$lte', t => {
	const result = query.parse({id: {$lte: 5}});

	t.is(result.ConditionExpression, '#k_id<=:v_id');
	t.deepEqual(result.ExpressionAttributeNames, {'#k_id': 'id'});
	t.deepEqual(result.ExpressionAttributeValues, {':v_id': 5});
});

test('$not value', t => {
	const result = query.parse({id: {$not: 5}});

	t.is(result.ConditionExpression, 'NOT #k_id=:v_id');
	t.deepEqual(result.ExpressionAttributeNames, {'#k_id': 'id'});
	t.deepEqual(result.ExpressionAttributeValues, {':v_id': 5});
});

test('$not expression', t => {
	const result = query.parse({id: {$not: {$lt: 5}}});

	t.is(result.ConditionExpression, 'NOT #k_id<:v_id');
	t.deepEqual(result.ExpressionAttributeNames, {'#k_id': 'id'});
	t.deepEqual(result.ExpressionAttributeValues, {':v_id': 5});
});

test('$not throws error if operator is unknown', t => {
	t.throws(query.parse.bind(query, {id: {$not: {a: 5}}}), 'Unknown operator a');
});

test('$in should throw an error if it is not an array', t => {
	t.throws(query.parse.bind(query, {id: {$in: 1}}), 'Please provide an array of elements for key `id`.');
});

test('$nin should throw an error if it is not an array', t => {
	t.throws(query.parse.bind(query, {id: {$nin: 1}}), 'Please provide an array of elements for key `id`.');
});

test('$in should throw an error if it is an empty array', t => {
	t.throws(query.parse.bind(query, {id: {$in: []}}), 'Do not provide an empty list of elements for key `id`.');
});

test('$nin should throw an error if it is an empty array', t => {
	t.throws(query.parse.bind(query, {id: {$nin: []}}), 'Do not provide an empty list of elements for key `id`.');
});

test('$in', t => {
	const result = query.parse({id: {$in: [1, 2, 3]}});

	t.is(result.ConditionExpression, '#k_id IN (:v_id_0,:v_id_1,:v_id_2)');
	t.deepEqual(result.ExpressionAttributeNames, {'#k_id': 'id'});
	t.deepEqual(result.ExpressionAttributeValues, {':v_id_0': 1, ':v_id_1': 2, ':v_id_2': 3});
});

test('$nin', t => {
	const result = query.parse({id: {$nin: [1, 2, 3]}});

	t.is(result.ConditionExpression, 'NOT #k_id IN (:v_id_0,:v_id_1,:v_id_2)');
	t.deepEqual(result.ExpressionAttributeNames, {'#k_id': 'id'});
	t.deepEqual(result.ExpressionAttributeValues, {':v_id_0': 1, ':v_id_1': 2, ':v_id_2': 3});
});

test('$contains', t => {
	const result = query.parse({array: {$contains: 5}});

	t.is(result.ConditionExpression, 'contains(#k_array, :v_array)');
	t.deepEqual(result.ExpressionAttributeNames, {'#k_array': 'array'});
	t.deepEqual(result.ExpressionAttributeValues, {':v_array': 5});
});

test('$exists is set to 1', t => {
	const result = query.parse({foo: {$exists: 1}});

	t.is(result.ConditionExpression, 'attribute_exists(#k_foo)');
	t.deepEqual(result.ExpressionAttributeNames, {'#k_foo': 'foo'});
	t.deepEqual(result.ExpressionAttributeValues, {});
});

test('$exists is set to true', t => {
	const result = query.parse({foo: {$exists: true}});

	t.is(result.ConditionExpression, 'attribute_exists(#k_foo)');
	t.deepEqual(result.ExpressionAttributeNames, {'#k_foo': 'foo'});
	t.deepEqual(result.ExpressionAttributeValues, {});
});

test('$exists is set to 0', t => {
	const result = query.parse({foo: {$exists: 0}});

	t.is(result.ConditionExpression, 'attribute_not_exists(#k_foo)');
	t.deepEqual(result.ExpressionAttributeNames, {'#k_foo': 'foo'});
	t.deepEqual(result.ExpressionAttributeValues, {});
});

test('$exists is set to false', t => {
	const result = query.parse({foo: {$exists: false}});

	t.is(result.ConditionExpression, 'attribute_not_exists(#k_foo)');
	t.deepEqual(result.ExpressionAttributeNames, {'#k_foo': 'foo'});
	t.deepEqual(result.ExpressionAttributeValues, {});
});

test('$exists is set to -1 should check for not exists', t => {
	const result = query.parse({foo: {$exists: -1}});

	t.is(result.ConditionExpression, 'attribute_not_exists(#k_foo)');
	t.deepEqual(result.ExpressionAttributeNames, {'#k_foo': 'foo'});
	t.deepEqual(result.ExpressionAttributeValues, {});
});

test('$exists is set to 2 should check for not exists', t => {
	const result = query.parse({foo: {$exists: 2}});

	t.is(result.ConditionExpression, 'attribute_not_exists(#k_foo)');
	t.deepEqual(result.ExpressionAttributeNames, {'#k_foo': 'foo'});
	t.deepEqual(result.ExpressionAttributeValues, {});
});

test('$beginsWith', t => {
	const result = query.parse({foo: {$beginsWith: 'bar'}});

	t.is(result.ConditionExpression, 'begins_with(#k_foo, :v_foo)');
	t.deepEqual(result.ExpressionAttributeNames, {'#k_foo': 'foo'});
	t.deepEqual(result.ExpressionAttributeValues, {':v_foo': 'bar'});
});

test('$beginsWith should parse a number to a string', t => {
	const result = query.parse({foo: {$beginsWith: 5}});

	t.is(result.ConditionExpression, 'begins_with(#k_foo, :v_foo)');
	t.deepEqual(result.ExpressionAttributeNames, {'#k_foo': 'foo'});
	t.deepEqual(result.ExpressionAttributeValues, {':v_foo': '5'});
});

test('$between', t => {
	const result = query.parse({foo: {$between: ['a', 'b']}});

	t.is(result.ConditionExpression, '#k_foo BETWEEN :v_foo_0 AND :v_foo_1');
	t.deepEqual(result.ExpressionAttributeNames, {'#k_foo': 'foo'});
	t.deepEqual(result.ExpressionAttributeValues, {':v_foo_0': 'a', ':v_foo_1': 'b'});
});

test('$between throws error when value is not an array', t => {
	t.throws(() => query.parse({foo: {$between: 'a'}}), '$between value for key `foo` should be an array, got `string`');
});

test('$between throws error if value does not have exact 2 elements', t => {
	t.throws(() => query.parse({foo: {$between: []}}), '$between value for key `foo` should have an exact length of `2`, got a length of `0`');
	t.throws(() => query.parse({foo: {$between: ['a']}}), '$between value for key `foo` should have an exact length of `2`, got a length of `1`');
	t.throws(() => query.parse({foo: {$between: ['a', 'b', 'c']}}), '$between value for key `foo` should have an exact length of `2`, got a length of `3`');
});

test('Should parse an object with two properties', t => {
	const result = query.parse({id: 5, foo: 'bar'});

	t.is(result.ConditionExpression, '#k_id=:v_id AND #k_foo=:v_foo');
	t.deepEqual(result.ExpressionAttributeNames, {'#k_id': 'id', '#k_foo': 'foo'});
	t.deepEqual(result.ExpressionAttributeValues, {':v_id': 5, ':v_foo': 'bar'});
});

test('$or', t => {
	const result = query.parse({$or: [{id: 5}, {id: 8}]});

	t.is(result.ConditionExpression, '#k_id=:v_id OR #k_id=:v_id_1');
	t.deepEqual(result.ExpressionAttributeNames, {'#k_id': 'id'});
	t.deepEqual(result.ExpressionAttributeValues, {':v_id': 5, ':v_id_1': 8});
});

test('$or throws error', t => {
	t.throws(query.parse.bind(query, {$or: {id: 5} as any}), 'Invalid expression $or. Value should be an array.');
});

test('$and', t => {
	const result = query.parse({$and: [{id: 5}, {id: 8}]});

	t.is(result.ConditionExpression, '#k_id=:v_id AND #k_id=:v_id_1');
	t.deepEqual(result.ExpressionAttributeNames, {'#k_id': 'id'});
	t.deepEqual(result.ExpressionAttributeValues, {':v_id': 5, ':v_id_1': 8});
});

test('$and throws error', t => {
	t.throws(query.parse.bind(query, {$and: {id: 5} as any}), 'Invalid expression $and. Value should be an array.');
});

test('throw error if operator is not supported', t => {
	t.throws(query.parse.bind(query, {id: {$g: 5}}), 'Unknown operator $g');
});

test('$and and $or', t => {
	const result = query.parse({$and: [{id: 5}, {id: 8}], $or: [{name: 'foo'}, {name: 'bar'}]});

	t.is(result.ConditionExpression, '(#k_id=:v_id AND #k_id=:v_id_1) AND (#k_name=:v_name OR #k_name=:v_name_1)');
	t.deepEqual(result.ExpressionAttributeNames, {'#k_id': 'id', '#k_name': 'name'});
	t.deepEqual(result.ExpressionAttributeValues, {':v_id': 5, ':v_id_1': 8, ':v_name': 'foo', ':v_name_1': 'bar'});
});
