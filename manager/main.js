const child_process = require('child_process');
const fs = require('fs');
const path = require('path');

const Discord = require('discord.js');
const nodegit = require('nodegit');
const rimraf = require('rimraf');

const keys = require('../keys.json');

const BOT_DEPLOY_DIR = './bot_deploy_dir'
const TOKEN = keys.manager_token;

async function checkout_remote_branch_for_bot_deploy(branch) {
    const REPO_PATH = 'https://github.com/jiphan/hayasaka.git'
    if (fs.existsSync(BOT_DEPLOY_DIR)) {
        rimraf.sync(BOT_DEPLOY_DIR);  // rm -rf on bot deploy dir, no need to deal with repo syncing issues
    }

    let repo = await nodegit.Clone(REPO_PATH, BOT_DEPLOY_DIR);
    // taken from https://github.com/nodegit/nodegit/blob/master/examples/checkout-remote-branch.js
    return repo.getHeadCommit()
        .then(head_commit => repo.createBranch(branch, head_commit, false))
        .then(reference => repo.checkoutBranch(reference))
        .then(() => repo.getReferenceCommit('refs/remotes/origin/' + branch))
        .then(commit => nodegit.Reset.reset(repo, commit, 3))
}

async function launch_bot_and_get_child_process(bot) {
    const bot_dir = path.join(BOT_DEPLOY_DIR, bot);

    return checkout_remote_branch_for_bot_deploy('feature/master/bot_manager')  // TODO: update before merge into master
        .then(() => {
            fs.copyFileSync('./keys.json', path.join(bot_dir, 'keys.json'));  // TODO: this is stupid, just take the path in via command line and pass it on
            return child_process.fork(path.join(bot_dir, 'main.js'));
        });
}

let hayasaka_process = null;
launch_bot_and_get_child_process('hayasaka').then(bot_process => {
    hayasaka_process = bot_process;
    console.log(bot_process);
    console.log(hayasaka_process);
});

const manager_bot = new Discord.Client();
manager_bot.login(TOKEN);
manager_bot.on('ready', () => console.log('another day of difficult work'));
manager_bot.on('message', msg => {
    BOT_PREFIX = 'MANAGER: ';
    if (!msg.content.startsWith(BOT_PREFIX)) {
        return;
    }

    let args = msg.content.substring(BOT_PREFIX.length).split(' ');
    switch (args[0]) {
        case 'ping':
            msg.channel.send('screw off')
            break;
        case 'reboot':
            if (hayasaka_process == null)
            {
                msg.channel.send('Hayasaka not known to be running right now.')
                break;
            }
            msg.channel.send('Rebooting Hayasaka...');
            hayasaka_process.kill();
            hayasaka_process = null;
            launch_bot_and_get_child_process('hayasaka').then(bot_process => {
                hayasaka_process = bot_process;
                msg.channel.send('Hayasaka rebooted with new code.')
            });
            break;
        default:
            msg.channel.send('No clue what you\'re saying. Known commands are "ping" and "reboot".');
            break;
    }
});
