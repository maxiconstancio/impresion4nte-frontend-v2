// /scripts/agentePedidos.js

const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(process.env.DB_URL || "postgres://user:pass@localhost:5432/impresion4nte");
const PedidoModel = require("../models/Pedido");

const Pedido = PedidoModel(sequelize);

const revisarPedidosPendientes = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado a la base de datos");

    const pedidos = await Pedido.findAll({ where: { estado: "pendiente" } });
    const ahora = new Date();

    pedidos.forEach((pedido) => {
      const actualizado = new Date(pedido.updatedAt);
      const dias = Math.floor((ahora - actualizado) / (1000 * 60 * 60 * 24));

      if (dias >= 3) {
        console.log(`⚠️ Pedido #${pedido.id} lleva ${dias} días pendiente (cliente: ${pedido.cliente})`);
        // Aquí podrías enviar un mail, mensaje o actualizar estado si querés
      }
    });
  } catch (err) {
    console.error("❌ Error ejecutando agente de pedidos:", err);
  } finally {
    await sequelize.close();
  }
};

revisarPedidosPendientes();
