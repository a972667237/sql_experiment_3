const mysql = require('mysql')
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'experiment_3'
})

let query = function( sql, values ) {
  return new Promise(( resolve, reject ) => {
    pool.getConnection(function(err, connection) {
      if (err) {
        reject( err )
      } else {
        connection.query(sql, values, ( err, rows) => {
          if ( err ) {
            e = {
              'code': err['code'],
              'status': 'error',
              'message': err['sqlMessage']
            }
            resolve(e);
          } else {
            rows['status'] = 'success'
            resolve( rows )
          }
          connection.release()
        })
      }
    })
  })
}

module.exports = { query }
