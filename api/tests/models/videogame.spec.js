const { Videogame, conn } = require("../../src/db.js");
const { expect } = require("chai");

describe("Videogame model", () => {
  before(() =>
    conn.authenticate().catch((err) => {
      console.error("Unable to connect to the database:", err);
    })
  );
  describe("Validators", () => {
    beforeEach(() => Videogame.sync({ force: true }));
    describe("name", () => {
      it("should throw an error if name is null", (done) => {
        Videogame.create({})
          .then(() => done(new Error("It requires a valid name")))
          .catch(() => done());
      });

      it("should work when its a valid name", () => {
        Videogame.create({ name: "Super Mario Bros" });
      });

      it("should throw an error if description is null", (done) => {
        Videogame.create({ name: "Minecraft" })
          .then(() => done(new Error("Se requiere una description valida")))
          .catch(() => done());
      });

      it("should throw an error if platforms is null", (done) => {
        Videogame.create({
          name: "Minecraft",
          description: "A game about mine and craft.",
        })
          .then(() => done(new Error("Se requiere validar la platforms")))
          .catch(() => done());
      });

      it("should work if name, desc and platforms are valid", () => {
        Videogame.create({
          name: "Minecraft",
          description: "A game about mine and craft.",
          platforms: "Xbox, OnePlayStation, 4PCXbox, 360PlayStation, 3macOS",
        });
      });
    });
  });
});