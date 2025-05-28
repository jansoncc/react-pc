import CryptoJS from "crypto-js";

const sign = "0102030405060708";

/**
 * 密码加密
 */
export function passwordEncryption(passwd) {
  //密码加密
  var iv = CryptoJS.enc.Utf8.parse(sign);
  var key = CryptoJS.enc.Utf8.parse(sign);
  var src = CryptoJS.enc.Utf8.parse(passwd);
  var aes = CryptoJS.AES.encrypt(src, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  //
  return aes.toString();
}