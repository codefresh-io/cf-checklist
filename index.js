const fs = require('fs')
const colors = require('colors')

const originalData = process.env.PR_DATA || fs.readFileSync('./test.md', 'utf-8')
const lines = originalData.split('\n')

const results = {
    type: {
        bugFix: getValue('bugFix'),
        newFeature: getValue('newFeature'),
        breakingChange: getValue('breakingChange'),
    },
    affectedAreas: {
        uiChange: getValue('uiChange'),
        analyticsReporter: getValue('analyticsReporterChange'),
        apiEvents: getValue('apiEventsChange'),
        apiGraphql: getValue('apiGraphqlChange'),
        e2e: getValue('e2eChanges'),
        eventHandler: getValue('eventHandlerChange'),
        graphQLSchema: getValue('graphQLSchemaChange'),
        database: getValue('databaseLayerChange'),
        eventBus: getValue('eventBusChange'),
        tooling: getValue('toolingChange'),
    },
    specialInformation: {
        newLib: getValue('newLib'),
        newIntegration: getValue('newIntegration'),
        newEnvVar: getValue('newEnvVar'),
        featureFlag: getValue('featureFlag'),
        newUIComponent: getValue('newUIComponent'),
    },
    checklist: [
        getValue('checklist1'),
        getValue('checklist2'),
        getValue('checklist3'),
        getValue('checklist4'),
        getValue('checklist5'),
        getValue('checklist6'),
        getValue('checklist7'),
    ]
}


function getValue(id) {
    for (const line of lines) {
        const selectedLine = line.includes('#' + id)
        if (selectedLine) {
            return !!(line.includes('[X]') || line.includes('[x]'))
        }
    }
}

function validatedType() {
    let noType = true

    if (
        results.type.bugFix ||
        results.type.newFeature ||
        results.type.breakingChange
    ) {
        noType = false
    }

    if (noType) {
        console.error('Please specify the type of this PR'.red)
        process.exit(1)
    }
}

function validatedAreas() {
    let noArea = true

    if (
        results.affectedAreas.uiChange ||
        results.affectedAreas.analyticsReporter ||
        results.affectedAreas.apiEvents ||
        results.affectedAreas.apiGraphql ||
        results.affectedAreas.e2e ||
        results.affectedAreas.eventHandler ||
        results.affectedAreas.graphQLSchema ||
        results.affectedAreas.database ||
        results.affectedAreas.eventBus ||
        results.affectedAreas.tooling
    ) {
        noArea = false
    }

    if (noArea) {
        console.error('Please specify The affected area for this PR'.red)
        process.exit(1)
    }
}

function validatedSpecialInformation() {
    if (results.specialInformation.newLib) {
        console.error('This PR requires special attention'.bgMagenta)
        console.error('There is a new library in this PR'.bgMagenta)
        console.log('\n')
    }

    if (results.specialInformation.newIntegration) {
        console.error('This PR requires special attention'.bgMagenta)
        console.error('There is a new integration in this PR'.bgMagenta)
        console.log('\n')
    }

    if (results.specialInformation.newEnvVar) {
        console.error('This PR requires special attention'.bgMagenta)
        console.error('This PR required to set up environment variable'.bgMagenta)
        console.log('\n')
    }

    if (results.specialInformation.featureFlag) {
        console.error('This PR requires special attention'.bgMagenta)
        console.error('This PR Require a new feature flag'.bgMagenta)
        console.log('\n')
    }

    if (results.specialInformation.newUIComponent) {
        console.error('This PR requires special attention'.bgMagenta)
        console.error('This PR includes a new UI shard component'.bgMagenta)
        console.log('\n')
    }
}

function validatedCheckList() {
    let checkPass = true

    for (const item of results.checklist) {
        if (!item) checkPass = false
    }

    if (!checkPass) {
        console.error(`You didn't complete the Pull request checklist`.red)
        process.exit(1)
    }
}

validatedType()
validatedAreas()
validatedCheckList()
validatedSpecialInformation()

console.log('PR checklist pass successfully'.green)
