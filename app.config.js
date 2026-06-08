module.exports = ({ config }) => {
  const IS_PRO = process.env.APP_VARIANT === 'pro' || process.env.EXPO_PUBLIC_APP_VARIANT === 'pro';

  return {
    ...config,
    name: IS_PRO ? "FemFlow Pro: Period Tracker & Ovulation Calendar" : "Serene Cycle: Period Tracker",
    slug: IS_PRO ? "femflow-pro" : "serene-cycle",
    icon: IS_PRO ? "./assets/images/icon-pro.png" : "./assets/images/icon.png",
    scheme: IS_PRO ? "femflow-pro" : "serene-cycle",
    ios: {
      ...config.ios,
      bundleIdentifier: IS_PRO ? "com.femflow.periodtracker.pro" : "com.serene.cycle.tracker",
    },
    android: {
      ...config.android,
      package: IS_PRO ? "com.femflow.periodtracker.pro" : "com.serene.cycle.tracker",
      adaptiveIcon: {
        ...config.android?.adaptiveIcon,
        backgroundColor: IS_PRO ? "#1A1214" : "#FFFFFF",
        foregroundImage: IS_PRO ? "./assets/images/android-icon-foreground-pro.png" : "./assets/images/android-icon-foreground.png",
      },
    },
    plugins: config.plugins ? config.plugins.map(plugin => {
      if (Array.isArray(plugin) && plugin[0] === 'expo-splash-screen') {
        return [
          'expo-splash-screen',
          {
            ...plugin[1],
            image: IS_PRO ? "./assets/images/splash-icon-pro.png" : "./assets/images/splash-icon.png",
            backgroundColor: IS_PRO ? "#1A1214" : "#FFF0F3",
          }
        ];
      }
      return plugin;
    }) : [],
  };
};
