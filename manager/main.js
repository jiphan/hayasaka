const child_process = require('child_process');
const fs = require('fs');
const nodegit = require('nodegit');
const path = require('path');
const rimraf = require('rimraf');

const BOT_DEPLOY_DIR = './bot_deploy_dir'

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

async function launch_bot(bot) {
    await checkout_remote_branch_for_bot_deploy('feature/master/bot_manager');
    
    const bot_dir = path.join(BOT_DEPLOY_DIR, bot);
    fs.copyFileSync('./keys.json', path.join(bot_dir, 'keys.json'));  // TODO: this is stupid, just take the path in via command line and pass it on
    child_process.fork(path.join(bot_dir, 'main.js'));
}

launch_bot('hayasaka');

setInterval(() => console.log('hi'), 1000);

// Goal 2: make manager an actual bot to make interacting easy, still launch hayasaka on manager startup
// Goal 3: let manager take reboot command to restart hayasaka with new code (hard code to master for now)