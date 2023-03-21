var childProc = require('child_process');
const axios = require('axios');

const requestWebsiteData = async () => {
    try {
        let request = await axios.get('https://deportick.queue-it.net/?c=deportick&e=argentinacurazao');
        if (request.request._redirectable._options.path === "/error?er=2&cid=en-US") {
            console.log("Page NOT available")
        }
    } catch (err) {
        console.log(err);
    }
   
    
}

requestWebsiteData()

// for (i=0; i<10; i++) {

// childProc.exec('open -a "Google Chrome" https://bircle.io');

// }

