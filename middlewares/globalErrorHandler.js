const globalErrorHandler = (err,req,res,next) => {
    console.log(err);
    res.status(500).json({
      success: false,
      message:
        "An internal server error occurred",
    });
}

module.exports = { globalErrorHandler }