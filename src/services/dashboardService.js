import api from "./api";

export async function obtenerResumen(fechaDesde, fechaHasta) {
  const params = {};
  if (fechaDesde) params.desde = fechaDesde;
  if (fechaHasta) params.hasta = fechaHasta;

  const res = await api.get("/dashboard", { params });
  return res.data;
}

export async function obtenerProximasCuotas(dias = 15) {
  const res = await api.get("/cuotas/proximas", { params: { dias } });
  return res.data;
}

export async function obtenerResumenCompleto() {
  const res = await api.get("/dashboard/completo");
  return res.data;
}

export async function obtenerEvolucionMensual() {
  const res = await api.get("/dashboard/mensual");
  return res.data;
}
