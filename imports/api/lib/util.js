/**
 * Common util library (client-side)
 *
 * David Kim
 */

export const Util = {
  isPfizer(clientId) {
    if(clientId) {
        // let _cids = ['pfCh2ocCtnCA4bWQj', 'EoEmbGfuvTHWQ5FLy', 'QB62EoDrRi54RwtbE', 'RumcWz4MEfHxTyfJw', 'ZLQqXnMog7mizDmKa', 'uSYqAWsXhhESnHFy3'];
        let _cids = ['pfCh2ocCtnCA4bWQj', 'EoEmbGfuvTHWQ5FLy', 'QB62EoDrRi54RwtbE', 'RumcWz4MEfHxTyfJw', 'ZLQqXnMog7mizDmKa', 'uSYqAWsXhhESnHFy3', 'xLgFQNT7ppz764zKf'];

        return clientId && _cids.includes(clientId);
    }
  },
  isAbbvie(clientId) {
      if(clientId) {
          let _cids = ['p4Qxg6iohvev5xvJ4'];

          return clientId && _cids.includes(clientId);
      }
  }, 
  isPharmOlam(clientId) {
    if(clientId) {
        let _cids = ['NygCQPeRCx2zhdxov'];

        return clientId && _cids.includes(clientId);
    }
  },  
  isGreenLight(clientId) {
    if(clientId) {
        let _cids = ['yaxryZQgLdE2YPzTC'];

        return clientId && _cids.includes(clientId);
    }
  },
  isBeigene(clientId) {
      if(clientId) {
          let _cids = ['RJRFwmzyTKyBkAyXS'];

          return clientId && _cids.includes(clientId);
      }
  },
  isSyneos(clientId) {
      if(clientId) {
          let _cids = ['QGgMX5T8A63zF7jtJ'];

          return clientId && _cids.includes(clientId);
      }
  },   
  isKPS(clientId) {
      if(clientId) {
          let _cids = ['mgRfAN7mJZJrgxWXE'];

          return clientId && _cids.includes(clientId);
      }
  }, 
  isAstraZeneca(clientId) {
      if(clientId) {
          let _cids = ['GcbNHDyBmTGgoRYiB'];

          return clientId && _cids.includes(clientId);
      }
  },    
  isDemoTrainingUser(user) {
    if(user && user.profile && user.profile.clients) {
      let _clients = user.profile.clients;

      if(_clients.length > 0) {
        let _true = false;

        _clients.forEach((c) => {
          if(c.name && c.name.includes("Demo")) {
            if(c.bus) {
              c.bus.forEach((b) => {
                if(b.name && b.name.includes("Training")) {
                  if(b.isBUChecked) {
                    _true = true;                
                  }
                }
              })
            }
          }
        })

        return _true;
      }
    }
  },    
  genRandomString(len) {
    var length = len || 10,
        charset = "123456789abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#*$",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  },
  genRandomString(len) {
    var length = len || 10,
        charset = "123456789abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#*$",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  },
  genRandomURL(len) {
    var length = len || 10,
        charset = "123456789abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789*$",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  },
  dateFormatN(thisDate) {
    if(thisDate) {
      var month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];        
      return  thisDate.getDate() + "-" + (month[thisDate.getMonth()]) + "-" + thisDate.getFullYear() + ' ' +
          ("0" + thisDate.getHours()).slice(-2) + ":" + ("0" + thisDate.getMinutes()).slice(-2) + ":" + 
          ("0" + thisDate.getSeconds()).slice(-2);    
    }
  },
  formatBytes(a,b) {
      if(0==a)return"0 Bytes";
      var c=1e3, d=b||2, 
          e=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],
          f=Math.floor(Math.log(a)/Math.log(c));
      return parseFloat((a/Math.pow(c,f)).toFixed(d))+" "+e[f]
  },
  hasKey(objectArray, key, keyValue, valueKey) { // [{key: value}, {key1: value1}, ...]

    if(objectArray && key && keyValue & valueKey) {
      if(Array.isArray(objectArray)) {
        let hasTheKey = false
        hasKey = objectArray.filter(function(o) {
          console.log(o, o[key])
          if(o[key] === keyValue) {            
            return o[valueKey]
          }
        })

        return hasTheKey
      }
    }
  },
  secondsToHMS(time) {
    var m = ~~(time / 60);
    var s = time % 60;

    var h = ~~(time / 3600);
    m = ~~((time % 3600) / 60);
    s = ~~(time % 60);

    var t = "";

    t += (h < 10 ? "0" : "") + h + ":";
    t += (m < 10 ? "0" : "") + m + ":";
    t += (s < 10 ? "0" : "") + s;

    return t;        
  },
  videoSecondsToHMS(time) {
    if(!time) {return}
    var m = ~~(time / 60);
    var s = time % 60;

    var h = ~~(time / 3600);
    m = ~~((time % 3600) / 60);
    s = time % 60;

    var t = "";

    t += (h > 0) ? (h < 10 ? "0" : "") + h + ":" : "";
    t += (m < 10 ? "0" : "") + m + ":";
    t += (s < 10 ? "0" : "") + s;

    return t;        
  },  
  secondsToHMSRaw(time) {
    if(!time) {return}
    var m = ~~(time / 60);
    var s = time % 60;

    var h = ~~(time / 3600);
    m = ~~((time % 3600) / 60);
    s = time % 60;

    var t = "";

    t += (h > 0) ? h+':' : ''
    t += (m > 0) ? m+':' : ''
    t += (s >= 0) ? Math.round(s) : ''

    return t;       
  },
  sort(a, b) {
    if(a && b) {
      return a - b;
    }
  },
  dateHMS(date) {
    if(date) {
        var month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        return  date.getDate() + "-" + (month[date.getMonth()]) + "-" + date.getFullYear() + ' ' +
            ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + 
            ("0" + date.getSeconds()).slice(-2);     
    }
  },
  timeSpent(t1, t2) {

    if(t1 && t2) {

      var t1 = (t1 instanceof Array) ? t1[0] : t1;
      var t2 = (t2 instanceof Array) ? t2[0] : t2;
    
      var aT1 = t1.split(':'),
          aT2 = t2.split(':'),
          rawT1 = (parseInt(aT1[0])*3600)+(parseInt(aT1[1])*60)+parseInt(aT1[2]),
          rawT2 = (parseInt(aT2[0])*3600)+(parseInt(aT2[1])*60)+parseInt(aT2[2]);

      var spentT = (rawT1 < rawT2) ? (rawT2 - rawT1) : (rawT1 - rawT2);           

      return spentT;
    }    
  },    
  timeSpentHMS(t1, t2) {

    if(t1 && t2) {

      var t1 = (t1 instanceof Array) ? t1[0] : t1;
      var t2 = (t2 instanceof Array) ? t2[0] : t2;

      var aT1 = t1.split(':'),
          aT2 = t2.split(':'),
          rawT1 = (parseInt(aT1[0])*3600)+(parseInt(aT1[1])*60)+parseInt(aT1[2]),
          rawT2 = (parseInt(aT2[0])*3600)+(parseInt(aT2[1])*60)+parseInt(aT2[2]);

      var spentT = (rawT1 < rawT2) ? (rawT2 - rawT1) : (rawT1 - rawT2);           

      return this.secondsToHMS(spentT);   
    }  
  },
  timeSpentDates(newDate, oldDae) {

    var diff = Math.floor((newDate - oldDae) / 1000);
                  // var diffTime = _pauseTimeRaw - diff + 35; 
    return diff;
  },    
  compareTimeHMS(t1, t2) {

      var aT1 = t1.split(':'),
          aT2 = t2.split(':'),
          rawT1 = (parseInt(aT1[0])*3600)+(parseInt(aT1[1])*60)+parseInt(aT1[2]),
          rawT2 = (parseInt(aT2[0])*3600)+(parseInt(aT2[1])*60)+parseInt(aT2[2]);

      return (rawT1 >= rawT2) ? true : false;  
  },    
  timeToSpendHMS(t1, t2, cp) {

      var aT1 = t1.split(':'),
          aT2 = t2.split(':'),
          rawT1 = (parseInt(aT1[0])*3600)+(parseInt(aT1[1])*60)+parseInt(aT1[2]),
          rawT2 = (parseInt(aT2[0])*3600)+(parseInt(aT2[1])*60)+parseInt(aT2[2]);
          // newTimeT = rawT1 + rawT2;

      var newTimeT = (cp) ? (rawT1 + rawT2): (rawT1 - rawT2);

      // console.log(t1, t2, cp, newTimeT);

      if(newTimeT > 0) {
        return this.secondsToHMS(newTimeT);
      } else {
        // toastr.error("Negative time.  Please add more.", "Error");
        return -1;
      }            
  },
  eraseCookie(name) {
    document.cookie = name + '=; Max-Age=0'
  }      
}

// export const genRandomString = (len) => {
//   var length = len || 10,
//       charset = "123456789abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#*$",
//       retVal = "";
//   for (var i = 0, n = charset.length; i < length; ++i) {
//       retVal += charset.charAt(Math.floor(Math.random() * n));
//   }
//   return retVal;
// }

// export const genRandomURL = (len) => {
//   var length = len || 10,
//       charset = "123456789abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789*$",
//       retVal = "";
//   for (var i = 0, n = charset.length; i < length; ++i) {
//       retVal += charset.charAt(Math.floor(Math.random() * n));
//   }
//   return retVal;
// }

// export const dateFormatN = (thisDate) => {
//   if(thisDate) {
//     var month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];        
//     return  thisDate.getDate() + "-" + (month[thisDate.getMonth()]) + "-" + thisDate.getFullYear() + ' ' +
//         ("0" + thisDate.getHours()).slice(-2) + ":" + ("0" + thisDate.getMinutes()).slice(-2) + ":" + 
//         ("0" + thisDate.getSeconds()).slice(-2);    
//   }
// }
