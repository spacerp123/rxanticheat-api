import { connect } from '../../../utils/database';

export const config = {
    api: {
      externalResolver: true,
    },
  }

export default async function handler(req, res) {
    if (req.method !== "GET") {
        res.status(405).json({ "message": "Método inválido" });
        return;
    }
    const { license } = req.query;
    if (!license) return;
    const connection = await connect();
    if (connection.isConnected()) {
        try {
            connection.db("rxanticheat").collection("rx_globalbans").findOne({ license }, function (err, globalBan) {
                if (!err && !globalBan) {
                    res.status(404).json({ "message": "[RxAnticheat] Banimento global não encontrado." });
                }
                if (err) {
                    res.status(400).json({ "message": "[RxAnticheat] Ocorreu um erro ao encontrar o banimento global especificado." });
                }
                if (globalBan) {
                    res.status(200).json({
                        "message": "[RxAnticheat] Você foi banido em todos os servidores que utilizam o nosso anticheat." + "\n\n[Licença]: " + license +
                            "\n\nCaso queira tentar remover o banimento entre em nosso discord: discord.com/invite/96KdPw4QCe"
                    });
                }
            });
        } finally {
            connection.close();
            return;
        }
    }
    res.status(400).json({ "message": "Não foi possível checkar a licença." });
}
