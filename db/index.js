const { Pool } = require('pg')


const pool = new Pool({
    user:'node_user',
    host:"localhost",
    database:"monstersdb",
    password:"password",
    port:5432
})

pool.query('SELECT * FROM monsters', (err,res) => {
    if (err){
        console.error(err);
        return
    }

})

module.exports = pool
