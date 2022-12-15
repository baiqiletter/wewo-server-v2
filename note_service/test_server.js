const seneca = require('seneca')()
    .use('./plugins/notes')
    .use('entity')
    .use(require('seneca-mongo-store'), { uri: 'mongodb://localhost:27017/note_db' })

const note = {
    title: '留学日记',
    author: '胡适',
    content: '# 留学日记\n胡适之啊胡适之！你怎么能如此堕落！先前订下的学习计划你都忘了吗？子曰：“吾日三省吾身。”不能再这样下去了！\n'
}

seneca.act({service:'note', cmd:'create', note: note}, (err, data) => {
    let note_id = data.id
    console.log('\ncallback (note, create) : ' + note_id)

    seneca.act({service:'note', cmd:'get', id:note_id}, (err, data) => {
        console.log('\ncallback (note, get) : ' + data.id)
    })
})