const github = require('@actions/github');
const core = require('@actions/core');

async function run() {
    const myToken = core.getInput('repo-token');
    const columnId = core.getInput('column-id');
    const labelName = core.getInput('label-name');
    const octokit = new github.GitHub(myToken);
    const context = github.context;

    console.log(context.payload.issue.labels);

    var found = false;
    context.payload.issue.labels.forEach(function(item){
        console.log(item.name)
        if(labelName == item.name){
            // the label matches
            console.log("the label matches: " + labelName)
            found = true;
        }
    })

    if(found){
        try{
            // This might fail since the card is already created?
            await octokit.projects.createCard({
                column_id: columnId,
                content_id: context.payload.issue.id,
                content_type: "Issue"
            });
        } catch (error) {
            // fetch all of the columns for the project
            var columnInformation = await octokit.projects.listColumns({
                project_id: 3181121
            });
            console.log(columnInformation)
        }
    }

    octokit.projects.listCards()

    return "Initial Testing";
}

run()
    .then(
        (testing) => { console.log(`Testing # ${testing}`) },
        (err)  => { console.log(err) }
    )
    .then(
        () => { process.exit() }
     )