import * as fs from 'fs';
/** 数据缓存 */
var data: Map<string, any> = new Map();

export class JsonUtil {

    /**
     * 通知资源名从缓存中获取一个Json数据表
     * @param name  资源名
     */
    static get(name: string): any {
        if (data.has(name)) {
            return data.get(name);
        }
        else {
            return null
        }

    }

    /**
     * 通知资源名从缓存中获取一个Json数据表
     * @param name  资源名
     */
    static loadData(name: string, mapData: any): boolean {
        if (data.has(name)) {
            return false;
        }
        else {
            //console.log("=========== gameloadjs name:",name)
            //console.log(`=========== load [ ${name}]:`, mapData)
            data.set(name, mapData);
            return true;
        }
    }

    // /**
    //  * 通知资源名加载Json数据表
    //  * @param name      资源名
    //  * @param callback  资源加载完成回调
    //  */
    //  static load(name: string, callback: Function): void {
    //     if (data.has(name))
    //         callback(data.get(name));
    //     else {
    //         var url = path + name;
    //         var jsonData  = require(url);
    //         data.set(name, jsonData);
    //         callback(jsonData);
    //     }
    // }

    // /**
    //  * 异步加载Json数据表
    //  * @param name 资源名
    //  */
    //  static loadAsync(name: string) {
    //     return new Promise((resolve, reject) => {
    //         if (data.has(name)) {
    //             resolve(data.get(name))
    //         }
    //         else {
    //             var url = path + name;
    //             var jsonData  = require(url);
    //             data.set(name, jsonData);
    //             resolve(jsonData)
    //         }
    //     });
    // }


    static loadJsonFile(filePath: string): any {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    try {
                        const jsonData = JSON.parse(data);
                        resolve(jsonData);
                    } catch (parseError) {
                        reject(parseError);
                    }
                }
            });
        });
    }

    /**
     * 通过指定资源名释放资源
     * @param name 资源名
     */
    static release(name: string) {
        //var url = path + name;
        data.delete(name);
    }

}