// 图谱服务插件

const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017/";  // MongoDB Connection URI
const client = new MongoClient(uri);
const collection = client.db("graph_db").collection("links")

function graph(options) {
    // 模式：连通测试
    this.add({service:'graph_service', cmd:'ping'}, (msg, respond) => {
        console.log('\n[receive] ping graph plugin, graph_service\n')
        respond(null, {response:'graph service is available', data:msg.data})
    })

    // 模式：建立/更新指定笔记的正向链接（因为新建/更新笔记时只会改变正向链接，反向链接是隐含的关联）
    this.add({service:'graph_service', cmd:'update'}, (msg, respond) => {
        // { links: [ { source: id, target: id, author: user} ], author: user }
        var links = msg.args.body.links
        var username = msg.args.body.author
        
        if (links.length == 0) {
            respond()
            return
        }

        var source = links[0].source
        console.log('\n[receive] update note links : ' + source)

        // 是否应该同时保存笔记的id和标题（用于在图谱中显示）？不需要，因为图谱的节点和链接数据是分开的，graph_service只负责链接部分
        // 首先删除已有链接，再新建链接。每一条数据只表示一条单向链接

        async function run() {
            try {
                await client.connect();

                const deleteResult = await collection.deleteMany({ source: source })
                console.log("deleted " + deleteResult.deletedCount + " documents");
                const insertResult = await collection.insertMany(links)
                console.log("inserted " + insertResult.insertedCount + " documents");
            } finally {
                // Ensures that the client will close when you finish/error
                await client.close();
                respond()
            }
        }
        run().catch(console.dir);
    })

    // 模式：删除指定笔记的所有相关链接
    this.add({service:'graph_service', cmd:'delete'}, (msg, respond) => {
        // { note: id }
        // 删除笔记时，删除相关链接
        var note_id = msg.args.body.note
        console.log('\n[receive] delete note links : ' + note_id)

        async function run() {
            try {
                await client.connect();

                const deleteResult = await collection.deleteMany({ source: note_id })
                console.log("deleted " + deleteResult.deletedCount + " documents");
                deleteResult = await collection.deleteMany({ target: note_id })
                console.log("deleted " + deleteResult.deletedCount + " documents");
            } finally {
                // Ensures that the client will close when you finish/error
                await client.close();
                respond()
            }
        }
        run().catch(console.dir);
    })

    // 模式：获取当前用户所有链接
    this.add({service:'graph_service', cmd:'get_all'}, (msg, respond) => {
        // { author: user }
        var username = msg.args.query.author

        var result = []

        async function run() {
            try {
                await client.connect();

                const cursor = await collection.find(
                    { author: username },
                    {  }
                )
                // print a message if no documents were found
                if ((await cursor.count()) === 0) {
                    console.log("no documents found!");
                }
                // replace console.dir with your callback to access individual elements
                await cursor.forEach((element) => {
                    result.push(element)
                });
            } finally {
                // Ensures that the client will close when you finish/error
                await client.close();
                console.log('\n[receive] get all ' + result.length + 'links of : ' + username)
                respond(null, result)
            }
        }
        run().catch(console.dir);
    })

    // 模式：重新生成当前用户的所有链接（似乎用不上），输入数据
    this.add({service:'graph_service', cmd:'refresh'}, (msg, respond) => {
        // { links: [ { source: id, target: id, author: user } ], author: user }
        var links = msg.args.body.links
        var username = msg.args.body.author

        console.log('\n[receive] refresh all links of ' + username)

        async function run() {
            try {
                await client.connect();
                
                const deleteResult = await collection.deleteMany({ author: username })
                console.log("Deleted " + deleteResult.deletedCount + " documents on source = " + note_id);
                const insertResult = await collection.insertMany(links)
                console.log(`${insertResult.insertedCount} documents were inserted`);
            } finally {
                // Ensures that the client will close when you finish/error
                await client.close();
                respond()
            }
        }
        run().catch(console.dir);
    })
}

module.exports = graph