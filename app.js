const express = require("express");
const pool = require("./db");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
app.get("/monsters", (req, res) => {
  pool.query(`SELECT * FROM monsters `, (err, response) => {
    if (err) {
      res.send({ error: err });
      console.error(err);
      return;
    }

    res.send({ monsters: response.rows });
  });
});

app.put("/put", async (req, res) => {
  const { name, id } = req.body;

  pool.query(
    `UPDATE monsters SET name = $1 WHERE id = $2   `,
    [name, id],
    (err, response) => {
      if (err) {
        console.error;
        res.send({ error: err });
        return;
      } else res.send({ response: response });
    }
  );
});

app.post("/post", async (req, res) => {
  const { name, personality } = req.body;
  try {
    const response = await pool.query(
      `INSERT INTO monsters(name, personality) VALUES ($1, $2)`,
      [name, personality]
    );
  } catch (err) {
   
    console.log(err);
  }
});

app.delete("/delete", (req, res) => {
  const { id } = req.body;
  pool.query("DELETE FROM monsters where id=$1", [id], (err, response) => {
    if (err) {
      res.send({ error: err });
      return;
    }
    res.send({ response: response });
  });
});

app.get("/habitats", async (req, res) => {
  try {
    const habitats = await pool.query("SELECT * FROM habitats");
    res.status(200).json({ habitats: habitats.rows });
  } catch (err) {
    res.send(err);
  }
});

app.get('/lives', async (req,res)=>{
    const { monster } = req.body
    try{
      const habitat = await pool.query("SELECT * FROM lives WHERE monster = $1 ",[monster])
      const habitatInfo = await pool.query("SELECT * FROM habitats WHERE name = $1 ", [habitat.rows[0].habitat])
      res.status(200).send({habitat:habitatInfo.rows})
    }
    catch(err){
        console.error(err)
        res.status(400).send({error:err})
    }
})

app.post("/habitats/post", async (req, res) => {
try{
  const { name, climate, temperature } = req.body;
  await pool.query(
    "INSERT INTO habitats(name,climate,temperature) VALUES($1, $2, $3)",
    [name, climate, temperature]
  );
  const habitats = await pool.query("SELECT * FROM habitats ORDER BY id DESC");
  res.status(200).json({ habitats: habitats.rows });
}
catch(err){
    res.send(err)
}
});

app.listen(3006, () => {
  console.log("running on 3006");
});
