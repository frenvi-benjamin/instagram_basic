const _iOSDevice = !!navigator.platform.match(/iPhone|iPod|iPad/)

const _Mac = !!navigator.platform.match(/Mac/)

// Opera 8.0+
var _Opera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

// Firefox 1.0+
var _Firefox = typeof InstallTrigger !== 'undefined';

// Safari 3.0+ "[object HTMLElementConstructor]" 
var _Safari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && window['safari'].pushNotification));

// Internet Explorer 6-11
var _IE = /*@cc_on!@*/false || !!document.documentMode;

// Edge 20+
var _Edge = !_IE && !!window.StyleMedia;

// Chrome 1 - 79
var _Chrome = !!window.chrome;

// Edge (based on chromium) detection
var _EdgeChromium = _Chrome && (navigator.userAgent.indexOf("Edg") != -1);

// Blink engine detection
var _Blink = (_Chrome || _Opera) && !!window.CSS;

console.log("_iOSDevice", _iOSDevice)
console.log("_Mac", _Mac)

console.log("_Opera", _Opera)
console.log("_Firefox", _Firefox)
console.log("_Safari", _Safari)
console.log("_IE", _IE)
console.log("_Edge", _Edge)
console.log("_Chrome", _Chrome)
console.log("_EdgeChromium", _EdgeChromium)
console.log("_Blink", _Blink)

function needsLineHeightAdjusted () {
    if (_iOSDevice) return true

    if (_Mac && !_Firefox) return true

    return false
}

if (needsLineHeightAdjusted()) {
    console.log("adjusting")
    document.querySelectorAll(".white-bars>span").forEach(element => {
        element.style.lineHeight = 2.4
    })

    const icon = document.querySelector("#zero-waste-icon")
    icon.style.marginBottom = "1rem"
    icon.style.maxWidth = "40px"
}