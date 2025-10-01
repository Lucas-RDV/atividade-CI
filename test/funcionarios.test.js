const request = require("supertest");
const { app, db } = require("../index");

afterAll(() => {
  db.close();
});

describe("API Funcionários", () => {
  it("Deve inserir 3 funcionários e listá-los", async () => {
    const funcionarios = [
      { nome: "Alice", funcao: "Dev", salario: 5000 },
      { nome: "Bob", funcao: "Designer", salario: 4000 },
      { nome: "Carol", funcao: "Gerente", salario: 7000 },
    ];

    for (const f of funcionarios) {
      const res = await request(app)
        .post("/api/funcionarios")
        .set("Content-Type", "application/json")
        .send(f);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("id");
    }

    const resLista = await request(app).get("/api/funcionarios");
    expect(resLista.statusCode).toBe(200);
    expect(Array.isArray(resLista.body)).toBe(true);
    expect(resLista.body.length).toBe(3);

    const nomes = resLista.body.map(f => f.nome);
    expect(nomes).toEqual(expect.arrayContaining(["Alice", "Bob", "Carol"]));
  });
});
