class Quote {
    constructor(bondName, date, time, lastPrice, closePrice, volume) {
        this.bondName = bondName;
        this.date = date;
        this.time = time;
        this.lastPrice = lastPrice;
        this.closePrice = closePrice; 
        this.volume = volume
      }
}

module.exports = Quote