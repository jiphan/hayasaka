const fs = require('fs');
const nodegit = require('nodegit');

const BOT_DEPLOY_DIR = './bot_deploy_dir'
const REPO_PATH = 'https://github.com/jiphan/hayasaka.git'

async function checkout_remote_branch(branch) {
    let repo = await (fs.existsSync(BOT_DEPLOY_DIR) ? nodegit.Repository.open(BOT_DEPLOY_DIR) 
                                                    : nodegit.Clone(REPO_PATH, BOT_DEPLOY_DIR));
    
    // taken from https://github.com/nodegit/nodegit/blob/master/examples/checkout-remote-branch.js
    return repo.getHeadCommit()
        .then(head_commit => repo.createBranch(branch, head_commit, false))
        .then(reference => repo.checkoutBranch(reference))
        .then(() => repo.getReferenceCommit('refs/remotes/origin/' + branch))
        .then(commit => nodegit.Reset.reset(repo, commit, 3))
}

checkout_remote_branch('working').then(() => console.log('complete'))