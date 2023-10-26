const trycatchmiddleware = (trycatch) => {
    return async (req, res, next) => {
        try {
            await trycatch(req, res);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: "failure",
                message: "error",
                error_message: error.message,
            });
        }
    };
};

module.exports = trycatchmiddleware

