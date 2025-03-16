module.exports = {
   webpack: {
      configure: (webpackConfig) => {
         webpackConfig.module.rules.forEach((rule) => {
            if (rule.oneOf) {
               rule.oneOf.forEach((oneOfRule) => {
                  if (oneOfRule.use) {
                     oneOfRule.use.forEach((useRule) => {
                        if (
                           useRule.loader &&
                           useRule.loader.includes("sass-loader")
                        ) {
                           useRule.options = {
                              ...useRule.options,
                              implementation: require("sass"), // Sử dụng Dart Sass mới nhất
                           };
                        }
                     });
                  }
               });
            }
         });
         return webpackConfig;
      },
   },
};
