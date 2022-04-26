const axios = require("axios");
const { Router } = require("express");
const { API_KEY } = process.env;
const { Videogame, Genre } = require("../db.js");

const router = Router();

//-------------TODOS LOS VIDEOJUEGOS--------------------
//----------Logica para traer Info de API --------------
/* const getApiInfo =  () => {
  const apiGamesInfo = 5; 
  // trae los 100 videoGames (20 por cada llamado)
  
  let nonstop=[]

  for (let i = 1; i <= apiGamesInfo; i++) {
     nonstop.push(axios.get(`https://api.rawg.io/api/games`, {
       params: { key: API_KEY, page: i },
      }).then(res=>res.data.results))}
      return Promise.all(nonstop)
     .then(res=>res.flat().map((game)=>{
      return{
      id: game.id,
      name: game.name,
      description: game.description,
      released: game.released,
      image: game.background_image,
      rating: game.rating,
      platforms: game.platforms.map((e) => e.platform.name),
      genres: game.genres.map((e) => e.name)}
     }))  
}
 */
const getApiInfo = async () => {
  const apiGamesInfo = 5; 
  // trae los 100 videoGames (20 por cada llamado)
  const games = [];

  for (let i = 1; i <= apiGamesInfo; i++) {
    const { data } = await axios.get(`https://api.rawg.io/api/games`, {
      params: { key: API_KEY, page: i },
    });
     
    data.results.map((game) => {
      games.push({
        id: game.id,
        name: game.name,
        description: game.description,
        released: game.released,
        image: game.background_image,
        rating: game.rating,
        platforms: game.platforms.map((e) => e.platform.name),
        genres: game.genres.map((e) => e.name),
      });
    });
  }  
  console.log(games)
  
  return games;
  
};

//----------Logica para traer Info de Data Base --------------
const getDBInfo = async () => {
  return await Videogame.findAll({
    include: {
      model: Genre,
      attributes: ["name"],
      // through: {
      //   attributes: [],
      // },
    },
  });
};
/* const getDBInfo =() => {
 const luis=  Videogame.findAll
  ({
    include: {
      model: Genre,
      attributes: ["name"],
      // through: {
      //   attributes: [],
      // },
    },
  })
   .then(res=>res )
   return luis
}; */

//Acoplo toda la info, API + DB
 const getAllInfo = async () => {
  const apiInfo = await getApiInfo();
  //console.log(apiInfo)
  let bdInfo = await getDBInfo();
  
  bdInfo = bdInfo.map((e) => {
    return {
      id: e.id,
      name: e.name,
      description: e.description,
      released: e.released,
      rating: e.rating,
      platforms: e.platforms,
      image: e.image,
      createdInDb: true,
      genres: e.genres.map((e) => e.name),
    };
  });
 console.log(bdInfo)
  return bdInfo.concat(apiInfo);

  // console.log(bdInfo);
  
};

/* router.get('/order',async(req,res) => {
       let all= await getAllInfo()
       let {order}= req.query
      switch (order) {
        case 'asc':
          console.log('aca estoy')
          all.sort((a,b)=>{
           return a.name.localeCompare(b.name) 
          })
          return res.json(all)
          
        default: 
          all.sort((a,b)=>{
          return b.name.localeCompare(a.name) 
         })
      }return res.json(all)
      }) */
     
//--------------------------------------------------
//--------------------------------------------------

//-------------VIDEOJUEGOS POR NOMBRE--------------
//------- Busco el Game en la API por NAME---------
const getApiByName = async (name) => {
 // console.log(name)
  const resAxios = await axios.get(`https://api.rawg.io/api/games`, {
    params: { key: API_KEY, search: name },
  });
  const results = resAxios.data.results;
  //console.log({results})
  let response = results.map((result) => {
    //console.log(result.rating)
    return {
      id: result.id,
      name: result.name,
      released: result.released,
      image: result.background_image,
      rating: result.rating,
      platforms: result.platforms.map((e) => e.platform.name),
      genres: result.genres.map((e) => e.name),
    };
  }); 
  //console.log({response})
  if(response.length) {
    return response;
  }
  return {
    msg:"No encontré nada, lo siento"
  };
};

// Busco el Game en mi base de Datos por NAME
const getDbByName = async (name) => {
  const DBInfo = await getDBInfo();
  const filtByName = await DBInfo.filter((games) =>
    games.name.toLowerCase().includes(name.toLowerCase())
  );
  return filtByName;
};


//Concateno y busco tanto en API como en DB

/* const getInfoByName = async (name) => {
  const apiByName = await getApiByName(name);
  const DbByName = await getDbByName(name);
  const infoNameTotal = DbByName.concat(apiByName);
  //const infoNameTotal = apiByName.concat(DbByName);
  return infoNameTotal;
}; */
const getInfoByName = (name) => {
  const apiByName = getApiByName(name)
  .then(resp=> resp);
  const DbByName = getDbByName(name)
  .then(resp2=>resp2);
 const luison=Promise.all([DbByName, apiByName]).then(([DbByName, apiByName]) =>
 DbByName.concat(apiByName))
 return luison
};



//----------------------------------------------------------
//----------------------------------------------------------

//    Hago la ruta GET: '/videogames' y '/videogames?name={game}'   //
router.get("/", async (req, res) => {
  let { name } = req.query;

  try {
    if (name) {
      const infoByName = await getInfoByName(name);
      //console.log({infoByName})
      res.status(200).send(infoByName);
    } else {
      const allData = await getAllInfo();
      res.status(200).send(allData);
    }
  } catch (e) {
    res.status(404).send("Juego no encontrado");
  }
});
// ------------Hago la ruta GET: '/videogames/:id'
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (id.length < 36) {
    try {
      var { data } = await axios.get(`https://api.rawg.io/api/games/${id}`, {
        params: { key: API_KEY },
      });
    } catch (error) {
      return res.status(404).send("ID invalido");
    }

    let platforms = data.platforms.map((e) => e.platform.name);
    let genres = data.genres.map((genre) => genre.name);

    let foundGame = {
      image: data.background_image,
      name: data.name,
      genres: genres,
      description: data.description_raw,
      released: data.released,
      rating: data.rating,
      platforms: platforms.join(", "),
    };

    return res.status(200).send(foundGame);
  }

  let gameDB = await Videogame.findOne({
    where: {
      id: id,
    },
    include: {
      model: Genre,
      attributes: ["name"],
      through: { attributes: [] },
    },
  });
  
  let genres = gameDB && gameDB.genres.map((genre) => genre.name);
   
   if(gameDB){
     let foundGame = {
       image: gameDB.image,
       name: gameDB.name,
       genres: genres,
       description: gameDB.description,
       released: gameDB.released,
       rating: gameDB.rating,
       platforms: gameDB.platforms,
     };
     return res.status(200).send(foundGame);
   }
   return res.status(404).send('No existe este VG en base de datos')


});

 /* router.delete('/:id', function(req, res, next) {
  const apiId = req.params.id;


 Videogame.destroy({ where: { id: apiId } })
      .then(api => res.json({
          error: false,
          message: 'Videogame deleted'
      }))
      .catch(error => res.json({
          error: true,
          error: error
      }));
}); */ 
/* router.delete("/delete/:id",async (req,res,next)=>{
  //console.log('hola')
  try {
      const idToDelete = req.params.id
  if(idToDelete && idToDelete.includes("-")){
  let result= await Videogame.destroy(
  { where: { id: idToDelete } })
 
  if(result) return res.status(200).send("Videogame deleted")
else return res.status(404).send("Videogame not found")                           
}
}
catch (error) {
  console.log('error in routes delete, /videogames/:id ', error);
  next(error)
}}) */



   /* router.put('/', async (req, res)=>  {
      let {id} = req.query
      let {name}= req.body
     let VGame=  await Videogame.findOne( {
        where: {
          id: id,
        },
      });
      await VGame.update({
        ...VGame,
        name : name
      }
      )
      return res.json({VGame, msg:'lo modifique'})
    })

 */

  



module.exports = router;

