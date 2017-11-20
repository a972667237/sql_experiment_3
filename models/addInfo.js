let tables = [
  'customers',
  'employees',
  'logs',
  'products',
  'purchases',
  'suppliers'
];

/*
{
 'nowt': 0,
 'data': {
     ...
  }
}
*/
async function addInfo(body){
  const { query } = require("./mysqlpool");
  let j = JSON.parse(body);
  let table_name = tables[j['nowt']];
  let table_attribute = [];
  let rows = await query('show columns from ' + table_name);
  rows.forEach(function(v, i){
    table_attribute.push(v['Field']);
  });
  let values = "";
  table_attribute.forEach(function(v, i){
    values = values + "'" + j['data'][v] + "',";
  });
  values = values.substring(0, values.length-1);
  let q = "insert into " + table_name + " values(" + values + ")";
  console.log(q);
  rows = await query(q);
  return rows;
}

module.exports = { addInfo }
