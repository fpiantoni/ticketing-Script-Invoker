const childProc = require('child_process')
const cron = require('node-cron')
const axios = require('axios')

const requestWebsiteData = async () => {
    // console.log('Verifying website data...')
    try {
        let request = await axios.get(
            'https://deportick.queue-it.net/?c=deportick&e=argentinacurazao'
        )
        if (
            request.request._redirectable._options.path ===
            '/error?er=2&cid=en-US'
        ) {
            console.log('Page NOT available')
            return true
        } else {
            console.log('Page is AVAILABLE')
            for (i = 0; i < 10; i++) {
                childProc.exec(
                    'open -a "Google Chrome" "https://deportick.queue-it.net/?c=deportick&e=argentinacurazao"'
                )
                childProc.exec(
                    'open -a "Brave Browser" "https://deportick.queue-it.net/?c=deportick&e=argentinacurazao"'
                )
                childProc.exec(
                    'open -a "Safari" "https://deportick.queue-it.net/?c=deportick&e=argentinacurazao"'
                )
            }
            return false
        }
    } catch (err) {
        console.log(err)
    }
}

let CronJob = cron.schedule('*/10 * * * * *', async () => {
    let script = await requestWebsiteData()
    if (script === false) console.log('Terminating Job'), CronJob.stop()
})

CronJob.start()
