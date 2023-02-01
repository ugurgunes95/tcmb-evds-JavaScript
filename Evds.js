require("dotenv").config();
const axios = require("axios");
const crypto = require("crypto");
const https = require("https");

class Evds {
  // Class yapısı için oluşturucu fonksiyon.
  constructor() {
    this.apiKey = process.env.API_KEY;
    this.lang = "TR";
    this.routes = this.#getRoutes();
    this.baseUrl = "https://evds2.tcmb.gov.tr/service/evds";
    this.routes = this.#getRoutes();
  }

  // Verileri çekmeyi sağlayan fonksiyon
  async getData() {
    return new Promise((resolve, reject) => {
      axios
        .get(
          `${this.baseUrl}${this.routes.GET_DATA.params}`,
          this.#getRequestConfigs()
        )
        .then((res) =>
          resolve({
            dün: {
              TARIH: res.data.items[0].Tarih,
              USD: res.data.items[0].TP_DK_USD_A_YTL,
              EUR: res.data.items[0].TP_DK_EUR_A_YTL,
            },
            bugün: {
              TARIH: res.data.items[1].Tarih,
              USD: res.data.items[1].TP_DK_USD_A_YTL,
              EUR: res.data.items[1].TP_DK_EUR_A_YTL,
            },
          })
        )
        .catch((err) => reject(err.message));
    });
  }

  // Axios ile istek atarken kullanılcak config objesini döndüren fonksiyon
  #getRequestConfigs() {
    return {
      httpsAgent: new https.Agent({
        secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
      }),
    };
  }

  // Endpoint bilgilerinin objesini döndüren fonksiyon. Şu an sadece bir endpoint değeri dönüyor.
  #getRoutes() {
    let yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
      .toISOString()
      .replace(/T.*/, "")
      .split("-")
      .reverse()
      .join("-");
    let today = new Date()
      .toISOString()
      .replace(/T.*/, "")
      .split("-")
      .reverse()
      .join("-");

    return {
      GET_DATA: {
        url: "",
        params: `/series=TP.DK.USD.A.YTL-TP.DK.EUR.A.YTL&startDate=${yesterday}&endDate=${today}&type=json&key=${this.apiKey}&formulas=&frequency=&aggregationTypes=&raw=true`,
      },
    };
  }
}

module.exports = Evds;
