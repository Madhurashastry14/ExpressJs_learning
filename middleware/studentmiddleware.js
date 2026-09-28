export const validateStudent = (req, res, next) => {
  const { name } = req.body();
  if (typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({
      message: "Valid name is required",
    });
  }
  next();
};
