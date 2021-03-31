import { connect } from '../../../utils/database';

export const config = {
    api: {
      externalResolver: true,
    },
  }

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.status(405).json({ "message": "Método inválido" })
        return;
    }
    const { license, reason, endpoint } = req.body;
    const connection = await connect();
    if (connection.isConnected()) {
        try {
            connection.db("rxanticheat").collection("rx_globalbans").insertOne({
                license: license,
                reason: reason,
                date: Date.now(),
                ip: endpoint
            }, function (err) {
                if (err) {
                    res.status(400).json({ "message": "Houve um erro!" })
                }else {
                    res.status(201).json({ "message": "Usúario banido globalmente." })
                }
            });
        } finally {
            connection.close();
            return;
        }
    }
    res.status(400).json({ "message": "Não foi possível banir globalmente o jogador." });
}