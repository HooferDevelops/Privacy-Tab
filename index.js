const { Plugin } = require('powercord/entities');
const { React, getModule, FluxDispatcher, i18n: { Messages } } = require('powercord/webpack');
const { description } = require('../pc-commands/commands/echo');
const { Powercord } = require('../pc-updater/components/Icons');
const { remote: { globalShortcut } } = require('electron');
const Settings = require("./Settings")

var privacyEnabled = false;
var get;
var set;
var style;

module.exports = class PrivacyTab extends Plugin {

    startPlugin(){
        get = this.settings.get;
        set = this.settings.set;
        // make sure it's safe, idk if needed, but why not?
        if (!get("toggle-keybind-value"))
            set("toggle-keybind-value", "Ctrl+Shift+P");
        if (!get("global-keybind"))
            set("global-keybind", true);
        if (!get("blur-scale"))
            set("blur-scale", 1);
        if (!get("grayscale"))
            set("grayscale", false);
        
        // init
        globalShortcut.register(get("toggle-keybind-value"), this.togglePrivacy);

        style = document.createElement('style');
        document.head.appendChild(style);
        style.type = 'text/css';
        style.appendChild(document.createTextNode(``));

        // register settings
        powercord.api.settings.registerSettings(this.entityID, {
            category: this.entityID,
            label: 'Privacy Tab',
            render: Settings
        });
    }

    pluginWillUnload(){
        globalShortcut.unregister(get("toggle-keybind-value"));
        powercord.api.settings.unregisterSettings(this.entityID);
        if (privacyEnabled){
            togglePrivacy();
        }
        style.parentNode.removeChild(style);
    }

    // keybind update event, from settings
    updateKeybinds(oldKeybind, newKeybind){
        console.log(this.settings)
        globalShortcut.unregister(oldKeybind)
        globalShortcut.register(newKeybind, this.togglePrivacy)
    }

    // toggle for privacy
    togglePrivacy(){
        // check for global keybind, user safety #1 :P
        if (!get("global-keybind") && !document.hasFocus()){
            return;
        }
        
        privacyEnabled = !privacyEnabled;
        var blurElement = document.getElementsByClassName("app-1q1i1E")[0];

        if (privacyEnabled){
            // enable blur
            var grayscale = "";
            if (get("grayscale")){
                grayscale = "grayscale(100%)"
            }
            blurElement.style = `transition: .3s linear; filter: blur(${get("blur-scale")*3}px) ${grayscale};`;
            style.replaceChild(document.createTextNode(`.layerContainer-yqaFcK * { blur(${get("blurscale")*3}px) }`), style.childNodes[0]);
        } else {
            // disable blur, durr
            blurElement.style = `transition: .3s linear;`;
            style.replaceChild(document.createTextNode(``), style.childNodes[0]);
        }

    }

};
