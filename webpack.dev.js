const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: './src/index.ts',
    context: path.resolve(__dirname, './'),
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '...'],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './dist/'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            // chunks: ['index']
        }),
        new CopyWebpackPlugin({
            patterns: [{
                from: './static', to: './static'
            }]
        })
    ],
};
