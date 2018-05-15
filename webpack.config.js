var path = require("path");
var DefinePlugin = require("webpack/lib/DefinePlugin");
var LoaderOptionsPlugin = require("webpack/lib/LoaderOptionsPlugin");
var NormalModuleReplacementPlugin = require("webpack/lib/NormalModuleReplacementPlugin");
var NoEmitOnErrorsPlugin = require("webpack/lib/NoEmitOnErrorsPlugin");
// var CopyWebpackPlugin = require('copy-webpack-plugin');

const assign = require('object-assign');
const extractThemesPlugin = require('./MapStore2/themes.js').extractThemesPlugin;
module.exports = {
    entry: assign({
        'webpack-dev-server': 'webpack-dev-server/client?http://0.0.0.0:8081', // WebpackDevServer host and port
        'webpack': 'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
        'mockups': path.join(__dirname, "js", "app"),
        'themes/default': path.join(__dirname, "assets", "themes", "index.less")
    }),
    output: {
        path: path.join(__dirname, "dist"),
        publicPath: "/dist/",
        filename: "[name].js"
    },
    plugins: [
        /*new CopyWebpackPlugin([
            { from: path.join(__dirname, 'node_modules', 'bootstrap', 'less'), to: path.join(__dirname, "web", "client", "dist", "bootstrap", "less") }
        ]),*/
        new LoaderOptionsPlugin({
            debug: true,
            options: {
                postcss: {
                    plugins: [
                      require('postcss-prefix-selector')({prefix: '.mockups', exclude: ['.ms2', '.mockups', '[data-ms2-container]']})
                    ]
                },
                context: __dirname
            }
        }),
        new DefinePlugin({
            "__DEVTOOLS__": true
        }),
        // new NormalModuleReplacementPlugin(/leaflet$/, path.join(__dirname, "MapStore2", "web", "client", "libs", "leaflet")),
        // new NormalModuleReplacementPlugin(/openlayers$/, path.join(__dirname, "MapStore2", "web", "client", "libs", "openlayers")),
        // new NormalModuleReplacementPlugin(/cesium$/, path.join(__dirname, "MapStore2", "web", "client", "libs", "cesium")),
        // new NormalModuleReplacementPlugin(/proj4$/, path.join(__dirname, "MapStore2", "web", "client", "libs", "proj4")),
        new NormalModuleReplacementPlugin(/ChartOptions.jsx/, path.join(__dirname, "js", "ms2override", "ChartOptions.jsx")),
        new NormalModuleReplacementPlugin(/ChartType.jsx/, path.join(__dirname, "js", "ms2override", "ChartType.jsx")),
        new NormalModuleReplacementPlugin(/ChartWizard.jsx/, path.join(__dirname, "js", "ms2override", "ChartWizard.jsx")),
        new NormalModuleReplacementPlugin(/SideCard.jsx/, path.join(__dirname, "js", "ms2override", "SideCard.jsx")),
        new NormalModuleReplacementPlugin(/Toolbar.jsx/, path.join(__dirname, "js", "ms2override", "Toolbar.jsx")),
        new NormalModuleReplacementPlugin(/WidgetsBuilder.jsx/, path.join(__dirname, "js", "ms2override", "WidgetsBuilder.jsx")),
        new NormalModuleReplacementPlugin(/Bar.jsx/, path.join(__dirname, "js", "ms2override", "Bar.jsx")),
        new NoEmitOnErrorsPlugin(),
        extractThemesPlugin
    ],
    resolve: {
      extensions: [".js", ".jsx"],
      alias: {
          "react": path.join(__dirname, "node_modules", "react")
      }
    },
    module: {
        noParse: [/html2canvas/],
        rules: [
            {
                test: /\.css$/,
                use: [{
                    loader: 'style-loader'
                }, {
                    loader: 'css-loader'
                }, {
                  loader: 'postcss-loader'
                }]
            },
            {
                test: /\.less$/,
                exclude: /themes[\\\/]?.+\.less$/,
                use: [{
                    loader: 'style-loader'
                }, {
                    loader: 'css-loader'
                }, {
                    loader: 'less-loader'
                }]
            },
            {
                test: /themes[\\\/]?.+\.less$/,
                use: extractThemesPlugin.extract({
                        fallback: 'style-loader',
                        use: ['css-loader', 'postcss-loader', 'less-loader']
                    })
            },
            {
                test: /\.woff(2)?(\?v=[0-9].[0-9].[0-9])?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        mimetype: "application/font-woff"
                    }
                }]
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9].[0-9].[0-9])?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: "[name].[ext]"
                    }
                }]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        name: "[path][name].[ext]",
                        limit: 8192
                    }
                }]
            },
            {
                test: /\.jsx?$/,
                exclude: /(ol\.js)$|(Cesium\.js)$|(cesium\.js)$/,
                use: [{
                    loader: "react-hot-loader"
                }],
                include: [
                    path.join(__dirname, "js"), path.join(__dirname, "MapStore2", "web", "client"),
                    path.join(__dirname, "js"), path.join(__dirname, "old_ms2_226bfec4", "web", "client")
                ]
            }, {
                test: /\.jsx?$/,
                exclude: /(ol\.js)$|(Cesium\.js)$/,
                use: [{
                    loader: "babel-loader"
                }],
                include: [
                    path.join(__dirname, "js"), path.join(__dirname, "MapStore2", "web", "client"),
                    path.join(__dirname, "js"), path.join(__dirname, "old_ms2_226bfec4", "web", "client")
                ]
            }
        ]
    },
    devServer: {},
    devtool: 'eval'
};
