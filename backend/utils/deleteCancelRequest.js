export const deleteExpiredCancelledRequests = async () => {
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
  
    await Request.deleteMany({
      status: 'cancelled',
      updatedAt: { $lt: fiveDaysAgo }
    });
  };
  