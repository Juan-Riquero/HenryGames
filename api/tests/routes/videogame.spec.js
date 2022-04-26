/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require("chai");
const session = require("supertest-session");
const app = require("../../src/app.js");
const { Videogame, conn } = require("../../src/db.js");

const agent = session(app);
const videogame = {
  name: "minecraft 3 TEST",
  description: " A game about mine and craft",
  released: "2009",
  rating: 4.2,
  platforms: "pc, xbox",
  genres: [4, 51],
  image: "",
};

describe("Videogame routes", () => {
  before(() =>
    conn.authenticate().catch((err) => {
      console.error("Unable to connect to the database:", err);
    })
  );
  beforeEach(() =>
    Videogame.sync({ force: true }).then(() => Videogame.create(videogame))
  );

  describe("GET /api/videogames", () => {
    it("should get 200", () =>
      agent.get("/api/videogames").expect(200)).timeout(10000);
  });

  describe("GET /api/genres", () => {
    it("Should get 200 when getting genres", () =>
      agent.get("/api/genres").expect(200));
  });

  describe("GET /api/videogames/:id", () => {
    it("Should get 404 wiht invalid ID", () => {
      agent.get("/api/videogames/iNvAliDID").expect(404);
    });
    it("Should get 200 with a valid ID", () => {
      agent.get("/api/videogames/123").expect(200);
    });
  });

  describe("GET /api/videogames?name={name}", () => {
    it("Should get 200 when using querys to searhc by name", () =>
      agent.get("/api/videogames?name=mario").expect(200));
    it("should get 15 results", () =>
      agent
        .get("/api/videogames?name=mario")
        .expect(200)
        .expect("Content-Type", /json/)
        .expect(function (res) {
          expect(res.body).length(15);
        }));
  });

  describe("POST /api/videogames", () => {
    it("Should get 200 when posting a game", () => {
      agent
        .post("/api/videogames")
        .send({
          name: "minecraft 2",
          description: "A game about mine and craft",
          released: "2009",
          rating: 4.2,
          platforms: "pc, xbox",
          genres: [4, 51],
          image: "",
        })
        .expect(200);
    });
    it("Should post the game to the DB", () => {
      agent
        .post("/api/videogames")
        .send({
          name: "minecraft 3 TEST",
          description: " Another mining game",
          released: "2010",
          rating: 4.2,
          platforms: "pc, xbox",
          genres: [4, 51],
          image: "",
        })
        .then(() => {
          Videogame.findOne({
            where: {
              name: "minecraft 3 TEST",
            },
          });
        })
        .then((game) => {
          expect(game).to.exist;
        });
    });
  });
});