const generateRentReport = (request) => {
    const perDayPrice = request.book.price;
    const deadline = new Date(request.deadlineDate);
    const actualReturn = new Date(request.actualReturnDate || new Date());
    const borrow = new Date(request.borrowDate);
    let extraDays = 0;
    let extraCharge = 0;
    let baseRent = 0;
    if (actualReturn > deadline) {
      extraDays = Math.ceil((actualReturn - deadline) / (1000 * 60 * 60 * 24));
      extraCharge = extraDays * 50;
    }
    if(actualReturn < deadline){
      baseRent = perDayPrice * ( Math.ceil((actualReturn - borrow) / (1000 * 60 * 60 * 24)));
    }
    else{
      baseRent = perDayPrice * request.requestedDays;
    }
    
    const totalRent = baseRent + extraCharge;
  
    return {
      baseRent,
      extraDays,
      extraCharge,
      totalRent
    };
  };
  export default generateRentReport;
  