module.exports = {
  webpack: (config, { buildId, dev }) => {
    config.module.rules.push({
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    })
    return config
  },
}