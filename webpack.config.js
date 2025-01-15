const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'production',
    entry: './src/script.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: ['.js', '.ts', '.mjs'],
        fallback: {
            "crypto": false,  // Use browser's native crypto
            "buffer": require.resolve("buffer/"),
            "stream": require.resolve("stream-browserify"),
            "path": require.resolve("path-browserify"),
            "util": require.resolve("util/"),
            "assert": require.resolve("assert/"),
            "url": require.resolve("url/"),
            "os": require.resolve("os-browserify/browser"),
            "https": require.resolve("https-browserify"),
            "http": require.resolve("stream-http"),
            "zlib": require.resolve("browserify-zlib"),
            "vm": require.resolve("vm-browserify")
        },
        alias: {
            process: "process/browser",
            "node:crypto": false  // Use browser's native crypto
        }
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                resolve: {
                    fullySpecified: false
                }
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            process: 'process/browser'
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_DEBUG': false,
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new webpack.NormalModuleReplacementPlugin(
            /^node:/,
            (resource) => {
                if (resource.request === 'node:crypto') {
                    resource.request = 'crypto';
                } else {
                    resource.request = resource.request.replace(/^node:/, '');
                }
            }
        )
    ],
    experiments: {
        topLevelAwait: true,
        outputModule: true
    }
};
