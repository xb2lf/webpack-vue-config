const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const CommonCSSLoader = [
  {
    /* loader: 'style-loader', */
    loader: 'vue-style-loader',
    options: {
      injectType: 'singletonStyleTag',
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
  entry: ['./src/main.js', './public/index.html'],
  output: {
    filename: 'js/[name].[hash:10].js',
    path: path.resolve(__dirname, 'dist'),
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
                loader: "thread-loader",
                options: {
                  worker: 2,
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
                  limit: 8 * 1024,
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
            exclude: /node_modules/,
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
    new VueLoaderPlugin(),
    new StyleLintPlugin({
      files: ['**/*.{css,sss,less,scss,sass}'],
      exclude: ['node_modules', 'dist'],
      extensions: ['css', 'less', 'scss', 'sass'],
      threads: true,
      fix: true,
    }),
    /**
     * 1. 帮助serviceworker快速启动
     * 2. 删除旧的serviceworker
    */
    new WorkboxWebpackPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
    }),
  ],
  mode: 'development',
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    compress: true,
    port: 3000,
    open: true,
    hot: true,
  },
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
    // 将当前模块的记录其他模块的hash值单独打包为一个文件，这个文件名为runtime
    // 解决：修改a文件导致b文件的contenthash变化
    runtimeChunk: {
      name: (entrypoint) => `runtime-${entrypoint.name}`,
    },
  },
  devtool: 'eval-source-map',
};
