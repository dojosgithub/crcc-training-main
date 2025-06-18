let _craaUrlsVar = {
  production: {
    gateURL: "https://crcc-trainning-aac8117ceeb3.herokuapp.com/",
    adminURL: "https://admin.craassessments.com/",
    portalURL: "https://portal.craassessments.com/",
    trainingURL: "https://training.craassessments.com/",
    pfizerAdminURL: "https://pfizeradmin.craassessments.com/",
  },
  development: {
    gateURL: "http://localhost:3300/",
    adminURL: "http://localhost:3200/",
    portalURL: "http://localhost:3600/",
    trainingURL: "http://localhost:3500/",
    pfizerAdminURL: "http://localhost:5200/",
  },
  demo: {
    gateURL: "https://appdemo.craassessments.com/",
    adminURL: "https://demo.craassessments.com/",
    portalURL: "http://localhost:3600/",
    trainingURL: "https://training-demo.craassessments.com/",
    pfizerAdminURL: "http://localhost:5200/",
  },
};

console.log("craa-urls isDemo: ", ___isDemo);

let _gateURL = _craaUrlsVar[process.env.NODE_ENV].gateURL;
let _adminURL = _craaUrlsVar[process.env.NODE_ENV].adminURL;
let _portalURL = _craaUrlsVar[process.env.NODE_ENV].portalURL;
let _trainingURL = _craaUrlsVar[process.env.NODE_ENV].trainingURL;
let _pfizerAdminURL = _craaUrlsVar[process.env.NODE_ENV].pfizerAdminURL;

if (___isDemo) {
  _gateURL = _craaUrlsVar["demo"].gateURL;
  _adminURL = _craaUrlsVar["demo"].adminURL;
  _portalURL = _craaUrlsVar["demo"].portalURL;
  _trainingURL = _craaUrlsVar["demo"].trainingURL;
  _pfizerAdminURL = _craaUrlsVar["demo"].pfizerAdminURL;
}

// export const _gateURL = _craaUrlsVar[process.env.NODE_ENV].gateURL;
// export const _adminURL = _craaUrlsVar[process.env.NODE_ENV].adminURL;
// export const _portalURL = _craaUrlsVar[process.env.NODE_ENV].portalURL;
// export const _trainingURL = _craaUrlsVar[process.env.NODE_ENV].trainingURL;
// export const _pfizerAdminURL = _craaUrlsVar[process.env.NODE_ENV].pfizerAdminURL;

export { _gateURL, _adminURL, _portalURL, _trainingURL, _pfizerAdminURL };
