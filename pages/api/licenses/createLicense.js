import { connect } from '../../../utils/database';

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

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
    const { license, ip, daysToExpire, password } = req.body;
    const connection = await connect();
    let date = new Date();
    if (password !== process.env.RX_LICENSE_PASSWORD) {
        res.status(401).json({"message": "Você errou a senha chave para criação de uma nova licença."});
        return;
    }
    if (connection.isConnected()) {
        try {
            connection.db("rxanticheat").collection("rx_licenses").insertOne({
                license: license,
                ip: ip,
                activation_date: date.getTime(),
                expiration_date: date.addDays(daysToExpire).getTime()
            }, function (err) {
                if (err) {
                    res.status(400).json({ "message": "Houve um erro, a licença pode já existe!" })
                }else {
                    res.status(201).json({ "message": "Licença criada com sucesso!" })
                }
            });
        } finally {
            connection.close();
            return;
        }
    }
    res.status(400).json({ "message": "Não foi possível criar a licença." });
}