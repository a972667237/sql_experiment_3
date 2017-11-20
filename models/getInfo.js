let tables = [
  'customers',
  'employees',
  'logs',
  'products',
  'purchases',
  'suppliers'
];
async function getInfo(mid){
  const {query} = require('./mysqlpool');
  let table_name = tables[mid];
  let table_attribute = [];
  let table_content = [];
  let rows = await query('show columns from '+table_name);
  rows.forEach(function(v, i){
    table_attribute.push(v['Field']);
  });
  rows = await query('select * from ' + table_name)
  rows.forEach(function(v, i){
    let info = [];
    table_attribute.forEach(function(va, inn){
      info.push(v[va]);
    });
    table_content.push(info);
  });
  return {
    table: table_name,
    attribute: table_attribute,
    content: table_content
  };
}

module.exports = { getInfo }
