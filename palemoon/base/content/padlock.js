var Cc = Components.classes;
var Ci = Components.interfaces;
var Cu = Components.utils;
Cu.import("resource://gre/modules/XPCOMUtils.jsm");

var padlock_PadLock =
{
  QueryInterface: XPCOMUtils.generateQI([Ci.nsIWebProgressListener,
                                         Ci.nsISupportsWeakReference]),
  onButtonClick: function(event) {
    event.stopPropagation();
    gIdentityHandler.handleMoreInfoClick(event);
  },
  onStateChange: function() {},
  onProgressChange: function() {},
  onLocationChange: function() {},
  onStatusChange: function() {},
  onSecurityChange: function(aCallerWebProgress, aRequestWithState, aState) {
    // aState is defined as a bitmask that may be extended in the future.
    // We filter out any unknown bits before testing for known values.
    const wpl = Ci.nsIWebProgressListener;
    const wpl_security_bits = wpl.STATE_IS_SECURE |
                              wpl.STATE_IS_BROKEN |
                              wpl.STATE_IS_INSECURE |
                              wpl.STATE_LOADED_MIXED_ACTIVE_CONTENT |
                              wpl.STATE_LOADED_MIXED_DISPLAY_CONTENT |
                              wpl.STATE_IDENTITY_EV_TOPLEVEL;
    var level;
    var highlight_urlbar = false;

    switch (aState & wpl_security_bits) {
      case wpl.STATE_IS_SECURE | wpl.STATE_IDENTITY_EV_TOPLEVEL:
        level = "ev";
        highlight_urlbar = true;
        break;
      case wpl.STATE_IS_SECURE:
      case wpl.STATE_IS_SECURE |
           wpl.STATE_LOADED_MIXED_DISPLAY_CONTENT:
        level = "high";
        highlight_urlbar = true;
        break;
      case wpl.STATE_IS_SECURE |
           wpl.STATE_LOADED_MIXED_ACTIVE_CONTENT:
        level = "low";
        highlight_urlbar = true;
        break;
      case wpl.STATE_IS_SECURE | wpl.STATE_IDENTITY_EV_TOPLEVEL |
           wpl.STATE_LOADED_MIXED_ACTIVE_CONTENT |
           wpl.STATE_LOADED_MIXED_DISPLAY_CONTENT:
      case wpl.STATE_IS_SECURE | wpl.STATE_IDENTITY_EV_TOPLEVEL |
           wpl.STATE_LOADED_MIXED_ACTIVE_CONTENT:
      case wpl.STATE_IS_SECURE | wpl.STATE_IDENTITY_EV_TOPLEVEL |
           wpl.STATE_LOADED_MIXED_DISPLAY_CONTENT:
      case wpl.STATE_IS_BROKEN:
        level = "broken";
        highlight_urlbar = true;
        break;
      default: // should not be reached
        level = null;
    }

    if (level != null && level != "broken") {
      var secUI = gBrowser.securityUI;
      //if we wanted, we could use secUI.state instead of aState above?
      var secState = secUI.QueryInterface(Ci.nsISSLStatusProvider).SSLStatus;
      if (secState) {
        secState.QueryInterface(Ci.nsISSLStatus);
        var proto = secState.protocolVersion;
        if (proto == Ci.nsISSLStatus.SSL_VERSION_3) {
          level = "broken";
        } else if (proto == Ci.nsISSLStatus.TLS_VERSION_1 ||
                   proto == Ci.nsISSLStatus.TLS_VERSION_1_1) {
          level = "low";
        }
        if (level != "broken") {
          var aCipher = secState.cipherSuite;
          if (aCipher.indexOf("_EXPORT") > -1) {
            level = "broken";
          } else if (aCipher.indexOf("_RC2_") > -1) {
            level = "broken";
          } else if (aCipher.indexOf("_RC4_") > -1) {
            if (aCipher.indexOf("_MD5") > -1) {
              level = "broken";
            } else if (aCipher.indexOf("_SHA") > -1) {
              level = "low";
            }
          } else if (aCipher == "TLS_RSA_WITH_3DES_EDE_CBC_SHA") {
            level = "low";
          } else if (aCipher == "TLS_DHE_RSA_WITH_3DES_EDE_CBC_SHA") {
            level = "low";
          }
        }
      }
    }

    try {
      var proto = gBrowser.contentWindow.location.protocol;
      if (proto == "about:" || proto == "chrome:" || proto == "file:" ) {
        // do not warn when using local protocols
        highlight_urlbar = false;
      }
    } catch(ex) {}

    let ub = document.getElementById("urlbar");
    if (ub) {
      // Only call if URL bar is present.
      if (highlight_urlbar) {
        ub.setAttribute("security_level", level);
      } else {
        ub.removeAttribute("security_level");
      }
    }

    try { // URL bar may be hidden
      padlock_PadLock.setPadlockLevel("padlock-ib", level);
      padlock_PadLock.setPadlockLevel("padlock-ib-left", level);
      padlock_PadLock.setPadlockLevel("padlock-ub-right", level);
    } catch(e) {}

    padlock_PadLock.setPadlockLevel("padlock-sb", level);
    padlock_PadLock.setPadlockLevel("padlock-tab", level);
  },

  setPadlockLevel: function(item, level) {
    let secbut = document.getElementById(item);
    var sectooltip = "";

    if (level) {
      secbut.setAttribute("level", level);
      secbut.hidden = false;
    } else {
      secbut.hidden = true;
      secbut.removeAttribute("level");
    }

    let s_ev = "Extended Validated";
    let s_hi = "Secure";
    let s_lo = "Weak security";
    let s_no = "Not secure";
    let gLocale = document.getElementById("bundle_browser");
    if(!!gLocale) {
      let n_ev = gLocale.getString("identity.padlock.ev");
      if(n_ev != null)
        s_ev = n_ev;
      let n_hi = gLocale.getString("identity.padlock.high");
      if(n_hi != null)
        s_hi = n_hi;
      let n_lo = gLocale.getString("identity.padlock.low");
      if(n_lo != null)
        s_lo = n_lo;
      let n_no = gLocale.getString("identity.padlock.broken");
      if(n_no != null)
        s_no = n_no;
    }
    switch (level) {
      case "ev":
        sectooltip = s_ev;
        break;
      case "high":
        sectooltip = s_hi;
        break;
      case "low":
        sectooltip = s_lo;
        break;
      case "broken":
        sectooltip = s_no;
        break;
      default:
        sectooltip = "";
    }
    secbut.setAttribute("tooltiptext", sectooltip);
  },

  prefbranch : null,

  onLoad: function() {
    gBrowser.addProgressListener(padlock_PadLock);

    var prefService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
    padlock_PadLock.prefbranch = prefService.getBranch("browser.padlock.");
    padlock_PadLock.prefbranch.QueryInterface(Components.interfaces.nsIPrefBranch2);
    padlock_PadLock.usePrefs();
    padlock_PadLock.prefbranch.addObserver("", padlock_PadLock, false);
  },
  onUnLoad: function() {
    padlock_PadLock.prefbranch.removeObserver("", padlock_PadLock);
  },
  observe: function(subject, topic, data)
  {
    if (topic != "nsPref:changed")
      return;
    if (data != "style" && data != "urlbar_background" && data != "shown")
      return;
    padlock_PadLock.usePrefs();
  },
  usePrefs: function() {
    var prefval = padlock_PadLock.prefbranch.getIntPref("style");
    var position;
    var padstyle;
    if (prefval == 2) {
      position = "ib-left";
      padstyle = "modern";
    } else if (prefval == 3) {
      position = "ub-right";
      padstyle = "modern";
    } else if (prefval == 4) {
      position = "statbar";
      padstyle = "modern";
    } else if (prefval == 5) {
      position = "tabs-bar";
      padstyle = "modern";
    } else if (prefval == 6) {
      position = "ib-trans-bg";
      padstyle = "classic";
    } else if (prefval == 7) {
      position = "ib-left";
      padstyle = "classic";
    } else if (prefval == 8) {
      position = "ub-right";
      padstyle = "classic";
    } else if (prefval == 9) {
      position = "statbar";
      padstyle = "classic";
    } else if (prefval == 10) {
      position = "tabs-bar";
      padstyle = "classic";
    } else {
      // 1 or anything else_ default
      position = "ib-trans-bg";
      padstyle = "modern";
    }

    var colshow;
    var colprefval = padlock_PadLock.prefbranch.getIntPref("urlbar_background");
    switch (colprefval) {
      case 3: 
        colshow = "all";
        break;
      case 2: 
        colshow = "secure-mixed";
        break;
      case 1: 
        colshow = "secure-only";
        break;
      default:
        // 0 or anything else: no shading
        colshow = "";
    }
    try {
      // XXX should probably be done automatically
      document.getElementById("urlbar").setAttribute("https_color", colshow);
    } catch(e) {}

    var lockenabled = padlock_PadLock.prefbranch.getBoolPref("shown");
    var padshow = "";
    if (lockenabled) {
      padshow = position;
    }

    try { // URL bar may be hidden
      document.getElementById("padlock-ib").setAttribute("padshow", padshow);
      document.getElementById("padlock-ib-left").setAttribute("padshow", padshow);
      document.getElementById("padlock-ub-right").setAttribute("padshow", padshow);
    } catch(e) {}

    document.getElementById("padlock-sb").setAttribute("padshow", padshow);
    document.getElementById("padlock-tab").setAttribute("padshow", padshow);

    try { // URL bar may be hidden
      document.getElementById("padlock-ib").setAttribute("padstyle", padstyle);
      document.getElementById("padlock-ib-left").setAttribute("padstyle", padstyle);
      document.getElementById("padlock-ub-right").setAttribute("padstyle", padstyle);
    } catch(e) {}

    document.getElementById("padlock-sb").setAttribute("padstyle", padstyle);
    document.getElementById("padlock-tab").setAttribute("padstyle", padstyle);

  }
};

window.addEventListener("load", padlock_PadLock.onLoad, false );
window.addEventListener("unload", padlock_PadLock.onUnLoad, false );
