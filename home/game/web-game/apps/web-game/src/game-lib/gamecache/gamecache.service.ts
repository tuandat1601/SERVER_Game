import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { Redis } from 'ioredis';
import { Logger } from '../log4js';

@Injectable()
export class GameCacheService {
    public client: Redis;
    constructor(private redisService: RedisService) {
        this.getClient();
    }

    async getClient() {
        this.client = await this.redisService.getClient()
    }

    async updateClient() {

        if (!this.client) {
            await this.getClient();
        }
    }

    /**
    * @Description: 封装设置redis缓存的方法
    * @param key {String} key值
    * @param value {String} key的值
    * @param seconds {Number} 过期时间 秒秒秒！！！
    * @return: Promise<any>
    */
    //设置值的方法
    public async setJSON(key: string, value: any, seconds?: number) {

        value = JSON.stringify(value);
        await this.updateClient();

        if (!seconds) {
            return await this.client.set(key, value);
        } else {
            return await this.client.set(key, value, 'EX', seconds);
        }
    }

    //获取值的方法
    public async getJSON(key: string) {

        //console.log("getJSON key:",key)

        await this.updateClient();

        var data = await this.client.get(key);

        if (!data) return null;

        //console.log("getJSON value:",JSON.parse(data))

        return JSON.parse(data);
    }


    //设置值的方法
    public async set(key: string, value: any, seconds?: number) {
        await this.updateClient();
        if (!seconds) {
            return await this.client.set(key, value);
        } else {
            return await this.client.set(key, value, 'EX', seconds);
        }
    }

    //获取值的方法
    public async get(key: string) {
        await this.updateClient();
        var data = await this.client.get(key);
        if (!data) return null;
        return data;
    }

    //更新过去时间
    //过期时间 秒秒秒！！！
    public async expire(key: string, seconds: number | string) {

        await this.updateClient();

        this.client.expire(key, seconds);

    }


    //删除值的方法
    public async del(key: string) {

        await this.updateClient();

        await this.client.del(key);
    }

    //以毫秒为单位返回 key 的剩余的过期时间
    public async pttl(key: string) {
        await this.updateClient();

        return await this.client.pttl(key);
    }

    //以秒为单位，返回给定 key 的剩余生存时间(TTL, time to live)。
    public async ttl(key: string) {
        await this.updateClient();

        return await this.client.ttl(key);
    }

    /**
     * 判断KEY 是否过期
     * @param key 
     * @returns 
     */
    public async checkKeyExpiration(key: string): Promise<boolean> {

        await this.updateClient();
        const ttl = await this.client.ttl(key);

        if (ttl < 0) {
            //console.log(`${key} does not exist or has no expiration set.`);
            return false;
        } else {
            //console.log(`${key} will expire in ${ttl} seconds.`);
            return true;
        }
    }

    /**
     * 模糊匹配 查找KEY
     * @param pattern 
     * @returns 
     */
    public async fuzzySearchKeys(pattern: string): Promise<string[]> {

        await this.updateClient();
        const keys = await this.client.keys(pattern);
        return keys;

    }

    //   // 示例用法  
    //   fuzzySearchKeys('user:*')  
    //     .then((matchingKeys) => {  
    //       console.log('匹配的键:', matchingKeys);  
    //     })  
    //     .catch((error) => {  
    //       console.error('发生错误:', error);  
    //     });

    // 清理缓存
    public async flushall(): Promise<any> {
        //暂时屏蔽 避免误操作
        // await this.updateClient();
        // await this.client.flushall();
    }

    //获取List值的方法
    public async getListJSON(key: string, index?: number) {

        await this.updateClient();

        var data: any
        if (index) {
            data = await this.client.lrange(key, index, index);
        } else {
            data = await this.client.lrange(key, 0, -1);
        }

        return data
    }


    //设置List值的方法
    public async setList(key: string, value: any, seconds?: number) {
        await this.updateClient();
        if (!seconds) {
            return await this.client.rpush(key, value);
        } else {
            return await this.client.rpush(key, value, 'EX', seconds);
        }
    }

    /**获取Hash值的方法 */
    public async getHash(key: string, field?: string) {

        await this.updateClient();

        var data: any
        if (field) {
            data = JSON.parse(await this.client.hget(key, field))
        } else {
            let alldata = await this.client.hgetall(key);
            for (const key in alldata) {
                if (Object.prototype.hasOwnProperty.call(alldata, key)) {
                    const element = alldata[key];
                    data = data || []
                    data.push(JSON.parse(element))
                }
            }
        }
        return data
    }


    /**
     * 设置Hash值的方法 
     * field 指定键
     * value 指定值
     */
    public async setHash(key: string, field: string, value: any) {
        await this.updateClient();
        value = JSON.stringify(value);
        return await this.client.hmset(key, field, value);
    }

    /**删除Hash指定值的方法 */
    public async hdel(key: string, field: string) {

        await this.updateClient();
        await this.client.hdel(key, field);
    }


}