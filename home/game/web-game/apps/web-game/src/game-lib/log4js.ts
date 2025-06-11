import * as Path from 'path';
import * as Log4js from 'log4js';
import * as Util from 'util';
import Moment from 'moment'; // 处理时间的工具
import * as StackTrace from 'stacktrace-js';
import Chalk from 'chalk';
import config from '../config/log4js';


//日志级别
export enum LoggerLevel{
    ALL = 'ALL',
    MARK = 'MARK',
    TRACE = 'TRACE',
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    FATAL = 'FATAL',
    OFF = 'OFF',
}

// 内容跟踪类
export class ContextTrace {
    constructor(
        public readonly context: string,
        public readonly path?: string,
        public readonly lineNumber?: number,
        public readonly columnNumber?: number
    ) { }
}

Log4js.addLayout('Awesome-nest', (logConfig: any) => {
    return (logEvent: Log4js.LoggingEvent): string => {
        let moduleName: string = '';
        let position: string = '';

        //日志组装
        const messageList: string[] = [];
        logEvent.data.forEach((value: any) => {
            if (value instanceof ContextTrace) {
                moduleName = value.context;
                //显示触发日志的坐标（行/列）
                if (value.lineNumber && value.columnNumber) {
                    position = `${value.lineNumber},${value.columnNumber}`;
                }
                return;
            }
            if (typeof value !== 'string') {
                value = Util.inspect(value, false, 3, true);
            }
            messageList.push(value);
        });
        //日志组成部分
        const messageOutput: string = messageList.join(' ');
        const positionOutput: string = position ? `[${position}]` : '';
        const typeOutput: string = `[${logConfig.type}]${logEvent.pid.toString()} - `;
        const dateOutput: string = `${Moment(logEvent.startTime).format('YYYY-MM-DD HH:mm:ss')}`;
        const moduleOutput: string = moduleName ? `[${moduleName}]` : '[LoggerService]';
        let levelOutput: string = `[${logEvent.level}]${messageOutput}`;
        //根据日志级别，用不同颜色区分
        switch (logEvent.level.toString()) {
            case LoggerLevel.DEBUG:
                levelOutput = Chalk.green(levelOutput);
                break;

            case LoggerLevel.INFO:
                levelOutput = Chalk.cyan(levelOutput);
                break;

            case LoggerLevel.WARN:
                levelOutput = Chalk.yellow(levelOutput);
                break;

            case LoggerLevel.ERROR:
                levelOutput = Chalk.red(levelOutput);
                break;

            case LoggerLevel.FATAL:
                levelOutput = Chalk.hex('#DD4C35')(levelOutput);
                break;

            default:
                levelOutput = Chalk.grey(levelOutput);
                break;
        }
        return `${Chalk.green(typeOutput)} ${dateOutput} ${Chalk.yellow(moduleOutput)}`
    }
})

// 注入配置
Log4js.configure(config);

//实例化
let category = "default";
if (process.env.RUNNING_ENV === 'prod') {
    category = "prod";
}
const logger = Log4js.getLogger(category);
logger.level = process.env.LOGGER_LEVEL

export class Logger {
    static loggerfight = Log4js.getLogger('fight');
    static loggerCustom = Log4js.getLogger('http');

    static fightData = {}

    static trace(...args) {
        logger.trace(Logger.getStackTrace(), ...args);
    }
    static debug(...args) {
        logger.debug(Logger.getStackTrace(), ...args);
    }

    static log(...args) {
        logger.info(Logger.getStackTrace(), ...args);
    }

    static info(...args) {
        logger.info(Logger.getStackTrace(), ...args);
    }

    static warn(...args) {
        logger.warn(Logger.getStackTrace(), ...args);
    }

    static warning(...args) {
        logger.warn(Logger.getStackTrace(), ...args);
    }

    static error(...args) {
        logger.error(Logger.getStackTrace(), ...args);
    }

    static fatal(...args) {
        logger.fatal(Logger.getStackTrace(), ...args);
    }

    static figtStart(roleid:string) {

        if (Logger.fightData[roleid]) {
            delete Logger.fightData[roleid];
        }

        Logger.fightData[roleid] = []
    }

    static fightlog(roleid:string,...args) {
        //Logger.fightData[roleid]

        if (process.env.FIGHT_LOG !== "TRUE") {
            return;
        }
        
        if (!Logger.fightData[roleid]) {
            return;
        }

        for (const key in args) {
            if (Object.prototype.hasOwnProperty.call(args, key)) {
                const data = args[key];
                Logger.fightData[roleid].push(data);
            }
        }
        
    }

    static fightEnd(roleid:string) {

        let fight_data = Logger.fightData[roleid];

        Logger.loggerfight.info(Logger.getStackTrace(), fight_data);

        delete Logger.fightData[roleid];
    }

    static access(...args) {
        Logger.loggerCustom.info(Logger.getStackTrace(), ...args);
    }

    // 日志追踪，可以追溯到哪个文件、第几行第几列
    static getStackTrace(deep: number = 2): string {
        const stackList: StackTrace.StackFrame[] = StackTrace.getSync();
        const stackInfo: StackTrace.StackFrame = stackList[deep];

        const lineNumber: number = stackInfo.lineNumber;
        const columnNumber: number = stackInfo.columnNumber;
        const fileName: string = stackInfo.fileName;
        const basename: string = Path.basename(fileName);
        return `${basename}(line: ${lineNumber}, column: ${columnNumber}): \n`;
    }
}