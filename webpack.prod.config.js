const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');

const CommonCSSLoader = [
  {
    loader: MiniCssExtractPlugin.loader,
    options: {
      publicPath: '../',
      hmr: false,
    },
  },
  {
    loader: 'css-loader',
    options: {
      modules: false,
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      plugins: () => [
        require('postcss-preset-env')(),
      ],
    },
  },
];

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'js/[name]-[chunkhash:10].js',
    path: path.resolve(__dirname, 'dist'),
    chunkFilename: 'js/[name].[contenthash:10].js'
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        exclude: /node_modules/,
        options: {
          fix: true,
        },
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          extractCSS: true,
          sourceMap: true,
        },
      },
      {
        oneOf: [
          {
            test: /\.css$/,
            use: [...CommonCSSLoader],
          },
          {
            test: /\.less$/,
            use: [
              ...CommonCSSLoader,
              'less-loader',
            ],
          },
          {
            test: /\.(sass|scss)$/,
            use: [
              ...CommonCSSLoader,
              'sass-loader'
            ],
          },
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: [
              {
                loader: 'thread-loader',
                options: {
                  worker: 2, // ??????2???
                },
              },
              {
                loader: 'babel-loader',
                options: {
                  presets: [
                    [
                      '@babel/preset-env',
                      {
                        useBuiltIns: 'usage',
                        corejs: {
                          version: 3,
                        },
                        targets: {
                          chrome: '60',
                          firefox: '50',
                          ie: '9',
                          safari: '10',
                          edge: '17',
                        },
                      },
                    ],
                  ],
                  babelrc: false,
                  cacheDirectory: true,
                },
              },
            ],
          },
          {
            test: /\.(png|jpg|gif|jpe?g|svg|webp)$/i,
            use: [
              {
                loader: 'url-loader',
                options: {
                  outputPath: 'assets/images/',
                  limit: 6 * 1024,
                  name: '[hash:10].[ext]',
                  esModule: false,
                },
              },
              {
                loader: 'image-webpack-loader',
                options: {
                  /* bypassOnDebug: true,
                  disable: true, */
                  mozjpeg: {
                    progressive: true,
                    quality: 65,
                  },
                  // optipng.enabled: false will disable optipng
                  optipng: {
                    enabled: true,
                  },
                  pngquant: {
                    quality: [0.65, 0.90],
                    speed: 4,
                  },
                  gifsicle: {
                    interlaced: false,
                  },
                  // the webp option will enable WEBP
                  webp: {
                    quality: 75,
                  },
                  svgo: {
                    multipass: true, // boolean. false by default
                    datauri: 'enc', // 'base64', 'enc' or 'unenc'. 'base64' by default
                    js2svg: {
                      indent: 2, // string with spaces or number of spaces. 4 by default
                      pretty: true, // boolean, false by default
                    },
                  },
                },
              },
            ],
          },
          {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: "url-loader",
            options: {
              limit: 10000,
              name: "static/font/[name].[hash:7].[ext]",
            },
          },
          {
            test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
            loader: "url-loader",
            options: {
              limit: 10000,
              name: "static/media/[name].[hash:7].[ext]",
            },
          },
          {
            test: /\.html/,
            loader: 'html-loader',
          },
          {
            exclude:
              /\.(css|less|sass|scss|js|jsx|ts|tsx|html|png|jpg|webp|gif|jpe?g|svg|mp4|webm|ogg|mp3|wav|flac|aacwoff2?|eot|ttf|otf)/,
            loader: "file-loader",
            options: {
              outputPath: 'assets/media/',
              name: '[name]-[hash:10].[ext]',
            },
          },
        ]
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      title: 'my-vue',
      favicon: './public/favicon.ico',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
      },
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name]-[contenthash:10].css',
    }),
    new OptimizeCssAssetsWebpackPlugin(),
    new VueLoaderPlugin(),
    /**
     * 1. ??????serviceworker????????????
     * 2. ????????????serviceworker
    */
    new WorkboxWebpackPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
    }),
    // ??????webpack???????????????????????????????????????????????????????????????
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, 'dll/manifest.json'),
    }),
    // ?????????????????????????????? ??????html????????????????????????
    new AddAssetHtmlWebpackPlugin({
      filepath: path.resolve(__dirname, 'dll/vue.js'),
    }),
  ],
  mode: 'production',
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.js', '.json', '.jsx', '.vue'],
    modules: [path.resolve(__dirname, './node_modules'), 'node_modules'],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    // ???????????????????????????????????????hash???????????????????????????????????????????????????runtime
    // ???????????????a????????????b?????????contenthash??????
    runtimeChunk: {
      name: (entrypoint) => `runtime-${entrypoint.name}`,
    },
    // ????????????
    minimize: true,
    minimizer: [
      // ????????????????????????????????????js???css
      new TerserWebpackPlugin({
        // ????????????
        cache: true,
        // ?????????????????????
        parallel: true,
        // ??????source-map
        sourceMap: true,
        // ????????????
        extractComments: true,
        terserOptions: {
          compress: {
            warnings: true,
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log'], // ??????console
          },
        },
      }),
    ],
  },
  devtool: 'source-map',
};
