function users(options) {
    this.add({service:'user_service', cmd:'ping'}, (msg, respond) => {
        console.log('\n[receive] ping users plugin, user_service\n')
        respond(null, {response:'users service is available', data:msg.data})
    })
}

module.exports = users