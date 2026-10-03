const errorhandler = (err, req, res, next) => {
  console.log(err);
  res.status(500).json({
    error: "Internal server error",
  });
};

export default errorhandler;
