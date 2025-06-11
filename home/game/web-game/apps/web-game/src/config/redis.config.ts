// redis 单点配置
const redisConfig = {
    port: 6379,
    host: '127.0.0.1',
    password: '123456',
    db: 0
}

//redis 集群配置
const redisClusterConfig = [

    {
        port: 6379,
        host: '127.0.0.1',
    },

    {
        port: 6380,
        host: '127.0.0.1',
    }
]

export { redisConfig, redisClusterConfig }