import pkg from "pactum";
const { spec } = pkg;
import { expect } from "chai";
import { asztonUser } from "../data/users.js";

describe("API tests", () => {
  it("Get all books and verify author and title of the first book", async () => {
    const response = await spec()
      .get("https://demoqa.com/BookStore/v1/Books")
      .expectStatus(200);
    expect(response.body.books[0].author).to.eql("Richard E. Silverman");
    expect(response.body.books[0].title).to.eql("Git Pocket Guide");
  });

  it("Login to the app and generate token", async () => {
    const response = await spec()
      .post("https://demoqa.com/Account/v1/GenerateToken")
      .withJson(asztonUser)
      .stores("TOKEN", "token")
      .expectStatus(200);
    expect(response.body.result).to.eql("User authorized successfully.");
    expect(response.body.status).to.eql("Success");
  });

  it("load token", async () => {
    const response = await spec()
      .get(
        "https://demoqa.com/Account/v1/User/99f9a612-023f-49eb-b285-796455b889f7"
      )
      .withHeaders({
        Authorization: "Bearer $S{TOKEN}",
      })
      .expectStatus(200);
    expect(response.body.username).to.eql("Aszton");
    expect(response.body.books).to.be.an("array");
  });
});
