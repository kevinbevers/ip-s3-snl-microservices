// next.config.js
const withPlugins = require('next-compose-plugins');
const optimizedImages = require('next-optimized-images');
const nextConfig = { 
  distDir: 'build', 
  images: {
    domains: ['localhost',"smitenoobleague.com","smitenoobleague.xyz","static.smite.guru","web2.hirez.com"],
  } 
};

module.exports = withPlugins([
  [optimizedImages, {
    /* config for next-optimized-images */
  }],

  // your other plugins here
  nextConfig
]);