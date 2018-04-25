
let utils = {};

/**
 * Return random integer
 * @param min
 * @param max
 * @returns {number}
 */

utils.randomInt = (min, max) => {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  rand = Math.round(rand);
  return rand;
};

/**
 * Return value by path from object. Path is "field1.subField2..."
 * @param obj
 * @param path
 * @param defVal
 * @returns {*}
 */

utils.get = (obj, path, defVal) => {
  if (typeof path !== 'string' || !obj) {
    return defVal;
  }
  path = path.split(/\./g);
  for (let i = 0; i < path.length; i++) {
    if (obj && typeof obj === 'object' && obj.hasOwnProperty(path[i])) {
      obj = obj[path[i]];
    } else {
      return defVal;
    }
  }
  return obj;
};

/**
 * Pad number to target width.
 * @param number
 * @param count
 * @returns {string}
 */

utils.pad = (number, count=2) => {
  return ('000000000000'+number).substr(-count);
};


utils.serverInfo = function () {
  const os = require('os');
  const moment = require('moment');
  const cpus = os.cpus().map(cpu => cpu.model);
  const processMem = process.memoryUsage();
  return {
    hostname: os.hostname(),
    freemem: `${utils.prettySize(os.freemem(), true)} of ${utils.prettySize(os.totalmem(),true)}`,
    procmem: [
      `rss: ${utils.prettySize(processMem.rss, true)}`,
      `external: ${utils.prettySize(processMem.external, true)}`,
      `heap: ${utils.prettySize(processMem.heapUsed,true)} of ${utils.prettySize(processMem.heapTotal,true)}`
    ].join(', '),
    uptime: moment.duration(os.uptime()).toISOString(),
    //loadavg: os.loadavg(),
    cpu:  `${cpus[0].replace(/\s+/gm, ' ')} x ${cpus.length}`
  }
};

/*
  Copyright (c) 2013, Yahoo! Inc. All rights reserved.
  Code licensed under the BSD License:
  http://yuilibrary.com/license/
*/

const sizes = [
  'Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'
];

/**
 Pretty print a size from bytes
 @method prettySize
 @param {Number} size The number to pretty print
 @param {Boolean} [nospace=false] Don't print a space
 @param {Boolean} [one=false] Only print one character
 @param {Number} [places=1] Number of decimal places to return
 */

utils.prettySize = (size, nospace, one, places) => {
  if (typeof nospace === 'object') {
    const opts = nospace;
    nospace = opts.nospace;
    one = opts.one;
    places = opts.places || 1;
  } else {
    places = places || 1;
  }
  
  let mysize;
  
  sizes.forEach((unit, id) => {
    if (one) {
      unit = unit.slice(0, 1);
    }
    const s = Math.pow(1024, id);
    let fixed;
    if (size >= s) {
      fixed = String((size / s).toFixed(places));
      if (fixed.indexOf('.0') === fixed.length - 2) {
        fixed = fixed.slice(0, -2);
      }
      mysize = fixed + (nospace ? '' : ' ') + unit;
    }
  });
  
  // zero handling
  // always prints in Bytes
  if (!mysize) {
    let unit = (one ? sizes[0].slice(0, 1) : sizes[0]);
    mysize = '0' + (nospace ? '' : ' ') + unit;
  }
  
  return mysize;
};


module.exports = utils;