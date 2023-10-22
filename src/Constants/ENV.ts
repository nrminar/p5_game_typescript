const enum ENV {

    //CANVAS DIMENSIONS
    CANVAS_WIDTH = 1920,
    CANVAS_HEIGHT = 1080,

    //GAME STATE/ENVIRONMENT VARIABLES
    ADELTAV = 0.1,
    ATTRACT_ACC = 6,
    ESCAPE_ACC = 5,
    STARTING_AST_NUM = 25,

    //asteroid - ship gravity distance vars
    PULL_DIST = 800,
    MIN_RELEASE_DIST = 40,

    //asteroid min r to split
    AST_SPLIT_R = 20,
}

export default ENV