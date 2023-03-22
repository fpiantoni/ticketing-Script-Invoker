const childProc = require('child_process')
const chromeLauncher = require('chrome-launcher')
const cron = require('node-cron')
const axios = require('axios')

//Please notice that you don't have to kill the terminal process becuasue it will close
// the chrome applications.

const launchChrome = async () => {
    const baseUrl =
        'https://deportick.queue-it.net/?c=deportick&e=argentinacurazao'
    const chromeFlags = [
        // '--disable-extensions',
        // '--disable-plugins',
        '--disable-sync',
        '--disable-local-storage',
        '--disable-session-storage',
        '--disable-application-cache',
        '--disable-cache',
        '--no-first-run',
        '--no-default-browser-check',
        // '--disable-infobars',
        '--incognito',
        baseUrl,
    ]

    const chromeOptions = {
        chromeFlags: chromeFlags,
    }

    let amountToLaunch = 20
    for (let i = 0; i < amountToLaunch; i++) {
        const chrome = await chromeLauncher.launch(chromeOptions)
        console.log(`Chrome debugging port running on ${chrome.port}`)
    }

    // Prevent SIGINT from terminating the Chrome process
    // process.on('SIGINT', () => {
    //     console.log('Caught interrupt signal')
    //     chrome.kill()
    //     process.exit()
    // })
}

const requestWebsiteData = async () => {
    // console.log('Verifying website data...')
    try {
        let request = await axios.get(
            'https://deportick.queue-it.net/?c=deportick&e=argentinacurazao'
        )
        console.log(request.request._redirectable._options.path)
        if (
            request.request._redirectable._options.path !=
            '/error?er=2&cid=en-US'
        ) {
            console.log('Page NOT available')
            return true
        } else {
            console.log('Page is AVAILABLE')

            launchChrome()
            childProc.exec(
                'open -a "Brave Browser" "https://deportick.queue-it.net/?c=deportick&e=argentinacurazao"'
            )
            childProc.exec(
                'open -a "Safari" "https://deportick.queue-it.net/?c=deportick&e=argentinacurazao"'
            )

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
