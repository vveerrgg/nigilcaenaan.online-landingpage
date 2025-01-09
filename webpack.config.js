const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/script.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        fallback: {
            "crypto": false,
            "buffer": require.resolve("buffer/"),
            "stream": require.resolve("stream-browserify")
        }
    }
};
