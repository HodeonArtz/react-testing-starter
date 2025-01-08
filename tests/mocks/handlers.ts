import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/categories", () => {
    return HttpResponse.json([
      { id: 1, name: "Electronics" },
      { id: 2, name: "Cosmethics" },
      { id: 3, name: "Hardware" },
    ]);
  }),
  http.get("/products", () => {
    return HttpResponse.json([
      { id: 1, name: "Prod1" },
      { id: 2, name: "Prod2" },
      { id: 3, name: "Prod3" },
    ]);
  }),
  http.get("/products/:id", ({ params }) => {
    const { id } = params;
    return HttpResponse.json({ id, name: `Prod${id}`, price: +id! * 10 });
  }),
];
