import { connect } from '../../../utils/database';
import requestIp from 'request-ip';

export const config = {
    api: {
      externalResolver: true,
    },
  }

export default async function handler(req, res) {
    if (req.method !== "GET") {
        res.status(405).json({"message": "Método inválido"});
        return;
    }
    const { license } = req.query;
    if (!license) {
        res.status(405).json({"message": "Método inválido"});
        return;
    }
    var ip = requestIp.getClientIp(req);
    const connection = await connect();
    if (connection.isConnected()) {
        try {
            connection.db("rxanticheat").collection("rx_licenses").findOne({license, ip}, function (err, license) {
                if (!err && !license) {
                    res.status(404).json({"message": "[RxAnticheat] Licença não encontrada."})
                }
                if (err) {
                    res.status(400).json({"message": "[RxAnticheat] Ocorreu um erro ao encontrar a licença especificada."})
                }
                if (license) {
                    let expirationDate = new Date(license.expiration_date);
                    let actualTime = Date.now();
                    if (actualTime < expirationDate.getTime()) {
                        res.status(200).json({"message": "[RxAnticheat] Licença aprovada. Data de expiração: " + convertDate(expirationDate.getTime()) + "."})
                    }else {
                        res.status(403).json({"message": "[RxAnticheat] Licença expirada, renove sua licença em nosso discord."})
                    }
                }
            });
        }finally {
            connection.close();
            return;
        }
    }
    res.status(400).json({"message": "Não foi possível se conectar"});
}

function convertDate(time) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(time)
    return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/') + " " + [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(":")
  }