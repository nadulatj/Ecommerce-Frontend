import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router'
import * as base64 from 'base-64';
import * as utf8 from 'utf8';

@Injectable({
    providedIn: 'root'
})
export class EncriptionService {

    constructor(private router: Router) { }

    key = "ddfbccae-b4c4-11"
    iv = "ddfbccae-b4c4-11"

    aes_encrypt(plaintext: any, key: any, iv: any) {
        key = CryptoJS.enc.Utf8.parse(key)
        iv = CryptoJS.enc.Utf8.parse(iv)
        let srcs = CryptoJS.enc.Utf8.parse(plaintext)
        let encrypted = CryptoJS.AES.encrypt(srcs, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        })
        return encrypted.ciphertext.toString()
    }

    aes_decrypt(ciphertext: any, key: any, iv: any) {
        key = CryptoJS.enc.Utf8.parse(key)
        iv = CryptoJS.enc.Utf8.parse(iv)
        let hex_string = CryptoJS.enc.Hex.parse(ciphertext)
        let srcs = CryptoJS.enc.Base64.stringify(hex_string)
        let decrypt = CryptoJS.AES.decrypt(srcs, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        })
        let decrypt2 = decrypt.toString(CryptoJS.enc.Utf8)
        return decrypt2.toString()
    }

    response_decript(response: any) {
        try {
            let plaintext = this.aes_decrypt(response, this.key, this.iv)
            return JSON.parse(JSON.stringify(this.repairJson(plaintext), null, 2))
        } catch (error) {
           
            this.router.navigate(['/unauth'])
            return false
        }
    }


    repairJson(data: any) {
        let str, obj
        data = this.replaceAll(data, "True", "true");
        data = this.replaceAll(data, "False", "false");

        try {
            str = data.replace(/'/g, '"')
            obj = JSON.parse(str);
        } catch (e) {
            try {
                obj = (0, eval)('(' + data + ')');
            } catch (e) {
                obj = {}
            }
        }

        return obj
    }


    replaceAll(str: string, find: string, replace: string) {
        var escapedFind = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        return str.replace(new RegExp(escapedFind, 'g'), replace);
    }

    request_encript(json_obj: any) {
        try {
            let json_str = JSON.stringify(json_obj)
            let ciphertext = this.aes_encrypt(json_str, this.key, this.iv)
            return ciphertext
        } catch (error) {
            return ""
        }
    }

    response_decript2(response: any) {
        try {
            const plaintext = this.aes_decrypt(response, this.key, this.iv);
            // console.log(plaintext,"sdcssd")
            return plaintext;
        } catch (error) {
            console.log(error);
            return false;
        }
    }


    base64Encoder(encoder_string:any){
        try{
            let json_str = JSON.stringify(encoder_string)
           
            return base64.encode(utf8.encode(json_str))
        }catch(error)
        {
            console.log(error)
            return ""
        }
       
    }

    base64Decoder(decoder_string:any){
        try{
            return base64.decode(decoder_string)
            // console.log(utf8.decode(base64.decode(decoder_string)))
            // return utf8.decode(base64.decode(decoder_string))
        }catch(error)
        {
            return ""
        }
       
    }
}