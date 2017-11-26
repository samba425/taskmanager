if(process.env.NODE_ENV === 'production') {
module.exports = {
    mongoURI: 'mongodb://samba425:samba425@ds157288.mlab.com:57288/taskmanager'
}
} else {module.exports = {
    mongoURI: 'mongodb://localhost:27017/taskmanager'
}
}