
import CryptoJS from '@/lib/core';
import tripledes from '@/lib/tripledes';
import ECB from '@/lib/mode-ecb';


function encrypt(content, srcKey) {

  if (!srcKey) {
    return "";
  }
  var keyLen = 8;
  var srcKeyLen = srcKey.length;

  if (srcKeyLen > keyLen) {
    srcKey = srcKey.substr(0, keyLen);

  } else {
    var paddLen = keyLen - srcKeyLen;
    for (var i = 0; i < paddLen; i++) {
      srcKey += "0";
    }
  }

  var key = window.CryptoJS.enc.Utf8.parse(srcKey);
  var encryptStr = window.CryptoJS.DES.encrypt(content, key, {
    mode: window.CryptoJS.mode.ECB,
    padding: window.CryptoJS.pad.Pkcs7
  });
  return encryptStr.toString();
}

export default {
  encrypt
};
