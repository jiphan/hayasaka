const fs = require('fs');

const BOT_WORKING_DIR = './bot_working_dir'

if (!fs.existsSync(BOT_WORKING_DIR)) {
    fs.mkdirSync(BOT_WORKING_DIR)
}

