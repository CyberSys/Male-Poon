#filter substitution
#filter emptyLines
#include ../../shared/pref/preferences.inc
#include ../../shared/pref/uaoverrides.inc

pref("startup.homepage_override_url","about:logo");
pref("app.releaseNotesURL", "https://github.com/ManchildProductions/Male-Poon/releases");

// Enable Firefox compatmode by default.
pref("general.useragent.compatMode", 2);
pref("general.useragent.compatMode.gecko", true);
pref("general.useragent.compatMode.firefox", true);

// Enable dynamic UA updates
pref("general.useragent.updates.enabled", true);
pref("general.useragent.updates.interval", 86400); // Once per day
pref("general.useragent.updates.retry", 7200);     // Retry getting update every 2 hours if failed
pref("general.useragent.updates.url", "https://dua.malepoon.org/?app=malepoon&version=%APP_VERSION%&channel=%CHANNEL%");

// Geolocation
pref("geo.wifi.uri", "https://pro.ip-api.com/json/?fields=lat,lon,status,message&key=K3TirHYiysBjnmD");

// ========================= updates ========================
// Updates disabled (Mac, etc.)
pref("app.update.enabled", false);
pref("app.update.url", "");
