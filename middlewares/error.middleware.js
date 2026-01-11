
export const errorHandler = (err, req, res, next) => {
  console.error('🚨 Error:', err);


  if (err.code?.startsWith('P20')) {
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Record not found' });
    }
    if (err.code === 'P2002') {
      return res.status(409).json({ message: 'Unique constraint failed (e.g. duplicate email or table number)' });
    }
    if (err.code === 'P2003') {
      return res.status(400).json({ message: 'Foreign key constraint failed – related record does not exist' });
    }
  }


  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid input data', details: err.message });
  }

  
  if (err.message?.includes('connect')) {
    return res.status(503).json({ message: 'Database unavailable – please try again later' });
  }

  
  res.status(500).json({
    message: 'An unexpected error occurred',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
};