'use strict';

const webpack = require('webpack');
const path = require('path');

module.exports = {
    target:  'web',
    cache:   false,
    context: __dirname,
    devtool: false,
    entry:   ['./static/js/main.js'],
    output:  {
        path:          path.join(__dirname, './static/dist'),
        filename:      'client.js',
        chunkFilename: '[name].[id].js'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                /* process.env */
            }
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
    ],
    module:  {
        loaders: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true
                    }
                },
                include: [
                    /src\//,
                    /node_modules\/telemed-components/
                ]
            }
        ],
        noParse: /\.min\.js/
    },
    resolve: {
        modules: [
            'src',
            'node_modules',
            'static'
        ],
        extensions: ['.json', '.js', '.css']
    },
    node:    {
        __dirname: true,
        fs: 'empty'
    }
};
