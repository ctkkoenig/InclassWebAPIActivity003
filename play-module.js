export class Play {
    constructor(playData) {
        this.title = playData.title;
        this.short = playData.short;
        this.acts = playData.acts.map(actData => new Act(actData));
    }
}

export class Act {
    constructor(actData) {
        this.name = actData.name;
        this.scenes = actData.scenes.map(sceneData => new Scene(sceneData));
    }
}

export class Scene {
    constructor(sceneData) {
        this.name = sceneData.name;
        this.title = sceneData.title;
        this.stageDirection = sceneData.stageDirection;
        this.speeches = sceneData.speeches;
    }
}
