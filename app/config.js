// 全局定义
const Protocol = 'http';

// 服务列表
const ServiceList = {
    user_service: {
        name: 'user_service',
        port: 3001,
    },
    note_service: {
        name: 'note_service',
        port: 3002,
    },
    graph_service: {
        name: 'graph_service',
        port: 3003,
    },
};

const Config = function(){};

Config.prototype.Protocol = Protocol;
Config.prototype.ServiceList = ServiceList;

module.exports = new Config();
