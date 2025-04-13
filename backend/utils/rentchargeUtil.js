export default  generateRentReport = (request) => {
    const perDayPrice = request.book.price;
    const deadline = new Date(request.deadlineDate);
    const actualReturn = new Date(request.actualReturnDate || new Date());
  
    let extraDays = 0;
    let extraCharge = 0;
  
    if (actualReturn > deadline) {
      extraDays = Math.ceil((actualReturn - deadline) / (1000 * 60 * 60 * 24));
      extraCharge = extraDays * 50;
    }
  
    const baseRent = perDayPrice * request.requestedDays;
    const totalRent = baseRent + extraCharge;
  
    return {
      baseRent,
      extraDays,
      extraCharge,
      totalRent
    };
  };
  