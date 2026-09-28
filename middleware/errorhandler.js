const errorhandler = (req, res, next) => {
  res.status(500).json({
    error: "Internal server error",
  });
};

export default errorhandler;
