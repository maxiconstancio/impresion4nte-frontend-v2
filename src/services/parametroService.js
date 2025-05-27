import api from "./api";

export async function obtenerParametros() {
  const res = await api.get("/parametros");
  return res.data;
}

export async function guardarParametro(clave, valor) {
  const res = await api.post("/parametros", { clave, valor });
  return res.data;
}
