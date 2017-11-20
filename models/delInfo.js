let tables = [
  'customers',
  'employees',
  'logs',
  'products',
  'purchases',
  'suppliers'
];


async function delInfo(body){
  const { query } = require("./mysqlpool");
  let j = JSON.parse(body);
  let table_name = tables[j['nowt']];
  let table_attribute = [];
  let rows = await query('show columns from ' + table_name);
  rows.forEach(function(v, i){
    table_attribute.push(v['Field']);
  });
  let attribute_name = table_attribute[j['pos']];
  let q = "delete from " + table_name + " where " + table_attribute[0] + " = '" + j['nid'] + "'";
  rows = await query(q);
  return rows;
}

module.exports = { delInfo }
