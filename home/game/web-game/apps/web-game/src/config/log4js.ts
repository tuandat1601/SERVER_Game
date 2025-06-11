import * as puth from 'path';
import path from 'path';
import { cTools } from '../game-lib/tools';
const baseLogPath = path.resolve(__dirname, `../../../${process.env.RUNNING_ENV}_logs`);//日志要写入哪个目录
const lastPath = process.env.RUNNING_ENV + "_" + process.env.RUNNING_TYPE + cTools.getAppPort();

let diy_appenders = []
let fight_cfg = { appenders: ['fight'], level: 'DEBUG' }
//console.log(`process.env.RUNNING_TYPE:`,process.env.RUNNING_TYPE);
if (process.env.RUNNING_TYPE === "GN") {
    diy_appenders = ['console', 'app', 'errors', 'fight'];
}
else {
    diy_appenders = ['console', 'app', 'errors'];
    fight_cfg = { appenders: ['app'], level: 'DEBUG' };
}
console.log(`cur_log_appenders:`, diy_appenders);

const log4jsConfig = {
    appenders: {
        console: {
            type: 'console',//打印到控制台
        },
        access: {
            type: 'dateFile',//会写入文件，并且按照日期分类
            filename: `${baseLogPath}/access/${lastPath}_access.log`,//日志文件名，会命名为：access.当前时间.log
            alwaysIncludePattern: true,
            pattern: 'yyyyMMdd',//时间格式
            daysToKeep: 30,
            maxLogSize: 1024 * 1024 * 500,
            numBackups: 10,
            category: 'http',
            keepFileExt: true,//是否保留文件后缀  
            layout: {
                type: 'pattern',
                pattern: '{"date":"%d","pid":"%z","data":\'%m\'}',

            },

        },
        app: {
            type: 'dateFile',
            filename: `${baseLogPath}/app-out/${lastPath}_app.log`,
            alwaysIncludePattern: true,
            maxLogSize: 1024 * 1024 * 500,
            layout: {
                type: 'pattern',
                pattern: '{"date":"%d","level":"%p","category":"%c","pid":"%z","data":\'%m\'}',

            },
            //日志文件按日期切割
            pattern: 'yyyyMMdd',
            daysToKeep: 30,
            numBackups: 10,
            keepFileExt: true,
        },

        fight: {
            type: 'dateFile',
            filename: `${baseLogPath}/fight/${lastPath}_fight.log`,
            alwaysIncludePattern: true,
            maxLogSize: 1024 * 1024 * 500,
            layout: {
                type: 'pattern',
                pattern: '{"date":"%d","level":"%p","category":"%c","pid":"%z","data":\'%m\'}',

            },
            //日志文件按日期切割
            pattern: 'yyyyMMdd',
            daysToKeep: 30,
            numBackups: 10,
            keepFileExt: true,
        },
        errorFile: {
            type: 'dateFile',
            filename: `${baseLogPath}/errors/${lastPath}_error.log`,
            alwaysIncludePattern: true,
            maxLogSize: 1024 * 1024 * 500,
            layout: {
                type: 'pattern',
                pattern: '{"date":"%d","level":"%p","category":"%c","pid":"%z","data":\'%m\'}',
            },
            //日志文件按日期切割
            pattern: 'yyyyMMdd',
            daysToKeep: 30,
            numBackups: 10,
            keepFileExt: true,
        },
        errors: {
            type: 'logLevelFilter',
            level: 'ERROR',
            appender: 'errorFile',
        },
    },
    categories: {
        default: {
            appenders: diy_appenders,
            level: 'DEBUG',
        },

        prod: {
            appenders: ['app', 'errors'],
            level: 'WARN',
        },

        fight: fight_cfg,
        info: { appenders: ['console', 'app', 'errors'], level: 'info' },
        access: { appenders: ['console', 'app', 'errors'], level: 'info' },
        http: { appenders: ['access'], level: 'DEBUG' },
    },
    pm2: true,//使用pm2来管理项目时打开
    pm2InstanceVar: 'INSTANCE_ID',// 会根据 pm2 分配的 id 进行区分，以免各进程在写日志时造成冲突
}
export default log4jsConfig;