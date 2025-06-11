import dayjs from 'dayjs';
import { formatISO } from "date-fns";
import { TableGameSys } from '../config/gameTable/TableGameSys';
export const cTools = {

    /**东八区时间 保存在json里是需要转成加时区的字符串*/
    newLocalDateString(datavar: Date = undefined) {

        let data: Date = datavar || new Date();

        return formatISO(data);
    },

    /**东八区时间 0点 保存在json里是需要转成加时区的字符串*/
    newLocalDate0String(datavar: Date = undefined) {

        let data: Date = datavar || new Date();
        data.setHours(0, 0, 0, 0);
        return formatISO(data);
    },

    /**保存的时候prisma 会转成UTC 所以这里加8小时再保存到MYSQL */
    newSaveLocalDate(datavar: Date = undefined) {

        let data: Date = datavar || new Date();

        data.setHours(data.getHours() + 8);
        return new Date(data);
    },

    /**保存的时候prisma 会转成UTC 所以这里加8小时再保存到MYSQL */
    newTransformToUTC8Date(date: Date | string | number = undefined) {
        let new_date: Date = date ? new Date(date) : new Date();

        new_date.setHours(new_date.getHours() + 8);
        return new Date(new_date);
    },

    /**取出MYSQL时间的时候 默认还是UTC0时区时间 要转成保存之前的时间*/
    newTransformToUTCZDate(date: Date | string | number = undefined) {
        let new_date: Date = date ? new Date(date) : new Date();

        new_date.setHours(new_date.getHours() - 8);
        return new Date(new_date);
    },

    newDate() {
        return new Date();
    },


    /**
     * 是否的隔天
     * @param startDate 
     * @param endDate 
     * @returns 
     */
    isNewDay(startDate: Date, endDate: Date) {

        let d1 = dayjs(startDate);
        let d2 = dayjs(endDate);

        // console.log("d1:",d1.year(),d1.month(),d1.date());
        // console.log("d2:",d2.year(),d2.month(),d2.date());

        if (d1.year() !== d2.year()) {
            return true;
        }

        if (d1.month() !== d2.month()) {
            return true;
        }

        if (d1.date() !== d2.date()) {
            return true;
        }

        return false;
    },

    GetServerOpenDays(startTime: string) {

        let open_day = cTools.GetDateDayDiff(new Date(startTime), new Date());
        open_day = Math.ceil(open_day) + 1;

        return open_day;
    },

    /**
     * 获取时间相差天数
     * @param startDate 
     * @param endDate 
     * @returns
     */
    GetDateDayDiff(startDate: Date, endDate: Date) {

        if (!startDate || !endDate) {
            return undefined;
        }

        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);

        let startTime = startDate.getTime();
        let endTime = endDate.getTime();
        let days = (endTime - startTime) / (1000 * 60 * 60 * 24);
        return days;
    },

    GetDateMinutesDiff(startDate: Date, endDate: Date) {
        let timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
        let minutes = Math.floor((timeDiff / (1000 * 60)));
        return minutes;
    },

    GetDateSecondsDiff(startDate: Date, endDate: Date) {
        let timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
        let seconds = Math.floor((timeDiff / 1000));
        return seconds;
    },

    checkSystemActTime(systemid: number) {

        if (!TableGameSys.checkHave(systemid)) {
            return false;
        }

        let cur_table = new TableGameSys(systemid);

        return cTools.checkActTime(cur_table.act_time);

    },

    /**
     * 解析系统是否在每日有效时间内
     * @param parmtime 
     */
    checkActTime(parmtime: string) {

        if (!parmtime || parmtime == "0" || parmtime.length <= 8) {
            return true
        }

        let str_ary = parmtime.split("-");
        let start_parm = str_ary[0];
        let end_parm = str_ary[1];

        let start_h = Number(start_parm.substring(0, 2));
        let start_min = Number(start_parm.substring(2, 4));
        let start_date = new Date();
        start_date.setHours(start_h, start_min, 0, 0);
        let start_time = start_date.getTime();

        let end_h = Number(end_parm.substring(0, 2));
        let end_min = Number(end_parm.substring(2, 4));
        let end_date = new Date();
        end_date.setHours(end_h, end_min, 0, 0);
        let end_time = end_date.getTime();

        let cur_time = new Date().getTime();

        if (cur_time >= start_time && cur_time <= end_time) {
            return true;
        }

        return false;
    },

    //[min,max]
    randInt(min: number, max: number) {
        return min + Math.round(Math.random() * (max - min));
    },

    randByWeight(weights: number[]) {
        let index = -1;
        if (weights.length > 0) {
            let total = weights.reduce((pre, cur) => pre + cur, 0);
            if (total > 0) {
                let rand = this.randInt(1, total);
                for (let i = 0; i < weights.length; i++) {
                    if (weights[i] >= rand) {
                        index = i;
                        break;
                    }
                    else {
                        rand -= weights[i];
                    }
                }
            }
        }
        return index;
    },

    randRecordByWeight(records: Record<any, any>, field: string = "weight") {
        let weights: number[] = [];
        let keys: any[] = [];
        for (const [k, v] of Object.entries(records)) {
            if (v[field] != undefined) {
                weights.push(v[field]);
                keys.push(k);
            }
        }
        if (weights.length > 0) {
            return keys[this.randByWeight(weights)]
        }
    },

    /**
     * 获取当前节点端口
     * @returns 
     */
    getAppPort() {

        let base_port = 9000;
        switch (process.env.RUNNING_TYPE) {
            case "LN":
                base_port = Number(process.env.APP_LN_PORT)
                break;
            case "GN":
                base_port = Number(process.env.APP_GN_PORT)
                break;
            case "SN":
                base_port = Number(process.env.SAVE_DATA_PROT)
                break;
            case "LOGN":
                base_port = Number(process.env.WEB_LOG_PROT)
                break;
            case "BEND":
                base_port = Number(process.env.WEB_BACKEND_PROT)
                break;
            case "CHATN":
                base_port = Number(process.env.WEB_SOCKET_PROT)
                break;
            case "CROSS":
                base_port = Number(process.env.WEB_CROSSDB_PROT)
                break;
            default:
                break;
        }

        if (!base_port) {
            return Number(process.env.RUNNING_NODE_ID);
        }

        let port = base_port + Number(process.env.RUNNING_NODE_ID);

        return port;
    },

    /**
     * 获取数据节点ID
     */
    getDataNodeId() {
        if (!process.env.DATA_NODE_ID) {
            return 1;
        }
        return Number(process.env.DATA_NODE_ID);
    },

    getTestModel() {
        return process.env.RUNNING_ENV.indexOf('prod') === -1 && process.env.TEST_OPEN === "TRUE";
    },

    countBytes(str: string): number {
        let byteLength = 0;

        for (let i = 0; i < str.length; i++) {
            const charCode = str.charCodeAt(i);
            if (charCode >= 0x00 && charCode <= 0x7F) {
                // 单字节字符（ASCII码）  
                byteLength += 1;
            } else if (charCode >= 0x80 && charCode <= 0x7FF) {
                // 双字节字符（某些特殊字符和西欧语言字符）  
                byteLength += 2;
            } else if (charCode >= 0x800 && charCode <= 0xFFFF) {
                // 三字节字符（大部分汉字和其他中文字符）  
                byteLength += 3;
            } else {
                // 其他字符（四字节字符等）  
                byteLength += 4;
            }
        }

        return byteLength;
    }
}
