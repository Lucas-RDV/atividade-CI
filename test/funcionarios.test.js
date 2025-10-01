const request = require("supertest");
const express = require("express");
const app = require("../index"); // se exportar app no index.js

describe("Teste API Funcionários", () => {
  it("Deve listar funcionários em JSON", async () => {
    const res = await request(app).get("/api/funcionarios");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
