const server = require("./app/sever");
const { PORT } = require("./config/envs");
const {logger}=require('./app/utils/logger.util');


server.listen(PORT,async()=>{
    logger.info(`Server started at port ${PORT}`);


    // logger.log(
    //     {
    //         message:`Server started at port ${PORT}`,
    //         level:'info'
    //     }
    // );

    console.log(`Server started at port ${PORT}`);
})
