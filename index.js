const chromeLauncher = require('chrome-launcher')
const path = require('path')
const os = require('os')
const fs = require('fs')

const url = process.argv[2]
if (!url) {
    console.error('Uso: node index.js <URL> [cantidad]')
    console.error(
        'Ejemplo: node index.js "https://www.deportick.com/event/belgranofinalapertura26" 10'
    )
    process.exit(1)
}

const amount = parseInt(process.argv[3], 10) || 10
const profilesRoot = path.join(os.tmpdir(), 'deportick-profiles')

const prepareProfiles = () => {
    if (fs.existsSync(profilesRoot)) {
        fs.rmSync(profilesRoot, { recursive: true, force: true })
    }
    fs.mkdirSync(profilesRoot, { recursive: true })
}

const launchInstance = async (i) => {
    const userDataDir = path.join(profilesRoot, `profile-${i}`)
    const cols = 4
    const winW = 480
    const winH = 600
    const x = (i % cols) * (winW / 2)
    const y = Math.floor(i / cols) * (winH / 3)

    const chrome = await chromeLauncher.launch({
        chromeFlags: [
            `--user-data-dir=${userDataDir}`,
            '--no-first-run',
            '--no-default-browser-check',
            '--disable-sync',
            '--disable-features=TranslateUI',
            `--window-size=${winW},${winH}`,
            `--window-position=${x},${y}`,
            url,
        ],
    })
    console.log(
        `[${i + 1}/${amount}] Chrome levantado en puerto ${chrome.port} - perfil: profile-${i}`
    )
}

const main = async () => {
    prepareProfiles()
    console.log(`\nLanzando ${amount} sesiones aisladas de Chrome hacia:`)
    console.log(`  ${url}\n`)

    for (let i = 0; i < amount; i++) {
        try {
            await launchInstance(i)
        } catch (err) {
            console.error(`[${i + 1}] error: ${err.message}`)
        }
        await new Promise((r) => setTimeout(r, 400))
    }

    console.log(
        `\nListo. ${amount} ventanas abiertas, cada una con cookies y storage independientes.`
    )
    console.log(
        'Cerralas manualmente cuando termines (CTRL+C en este terminal no las cierra).'
    )
}

main()
