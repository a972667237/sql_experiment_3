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
  "aim": "Vestal2",
  "pos": 3,
  "nid": "c000",
  "nowt": 0
}
*/
async function updateInfo(body){
  const { query } = require("./mysqlpool");
  let j = JSON.parse(body);
  let table_name = tables[j['nowt']];
  let table_attribute = [];
  let rows = await query('show columns from ' + table_name);
  rows.forEach(function(v, i){
    table_attribute.push(v['Field']);
  });
  let attribute_name = table_attribute[j['pos']];
  if(attribute_name.indexOf('time')!=-1){
    j['aim'] = j['aim'].replace(/[a-zA-Z]/g, ' ');
  }
  let q = "update " + table_name + " set " + attribute_name + " = '" + j['aim'] + "' where " + table_attribute[0] + " = '" + j['nid'] + "'";
  rows = await query(q);
  return rows;
}

module.exports = { updateInfo }
