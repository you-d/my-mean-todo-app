var path = require("path");
var webpack = require("webpack");
var webpackExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
    debug: true,
    cache: false,
    entry: {
        ngApp: path.join(__dirname, "frontend/js/ngApp.js"),
        reactComponents: path.join(__dirname, "frontend/jsx/mainReact.js"),
        libCombo: [path.join(__dirname, "node_modules/angular/angular.min.js"),
                   path.join(__dirname, "node_modules/angular-resource/angular-resource.min.js"),
                   path.join(__dirname, "node_modules/angular-route/angular-route.min.js"),
                   path.join(__dirname, "node_modules/angular-cookies/angular-cookies.min.js")],
        style: [path.join(__dirname, "node_modules/normalize.css/normalize.css"),
                path.join(__dirname, "frontend/css/style.css")]
    },
    output: {
        path: path.join(__dirname, "public/dist/"),
        filename: "[name].js"
    },
    module: {
        loaders: [
            { test: /\.css$/ ,
              loader: webpackExtractTextPlugin.extract("style-loader","css-loader")
            },
            { test: /.js?$/,
              loader: 'babel-loader',
              exclude: /node_modules/,
              query: {
                presets: ['es2015', 'react']
              }
            }
        ]
    },
    resolve: {},
    plugins: [
        new webpack.optimize.UglifyJsPlugin({minimize: true}),
        // to force use the production version of React.JS libraries
        //new webpack.DefinePlugin({'process.env': {'NODE_ENV':JSON.stringify('production')}}),
        new webpackExtractTextPlugin("style.css", {allChunks: true})
    ]
};
