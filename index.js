
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const scoreEl = document.querySelector('#scoreEl')
const level = document.querySelector('#level')
const highscore = document.querySelector('#highscore')

const gameOver = document.querySelector('#gameOver')


// const data = "console.log('Hello, world!');";
// const filename = "./example.js";

// // Create a new Blob object with the data and set the MIME type
// const blob = new Blob([data], {type: "application/javascript"});

// // Create a URL object and set the href attribute to the object URL
// const url = URL.createObjectURL(blob);

// // Create a new <a> element and set the href and download attributes
// const link = document.createElement("a");
// link.href = url;
// link.download = filename;

// // Simulate a click on the link to trigger the download
// link.click();

// // Revoke the object URL to free up memory
// URL.revokeObjectURL(url);



canvas.width = innerWidth
canvas.height = innerHeight

let pellets = []
let boundaries = []
let powerUps = []

let keys = {
    w: {
        pressed: false,
    },
    a: {
        pressed: false,
    },
    s: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
}

let ghosts = []
let player
let map = maps[0]
let prevMap = 0
let lastkey = ''
let score = 0
//let highscores = []
let addHighScore = true
let selectedMap
let lost = false

const speedPlayer = 5
let gameWon = false
let animationId

init()

function init() {
    pellets = []
    boundaries = []
    powerUps = []
    // only reset score if init is called with r, not when next level is selected
    // if (lost === true) {
    //     score = 0
    //     selectedMap = 0
    // }
    
    lost = false
    addHighScore = true

    ghosts = [
        new Ghost({
            position: {
                x: Boundary.width * 6 + Boundary.width / 2,
                y: Boundary.height + Boundary.height / 2
            },
            velocity: {
                x: Ghost.speed,
                y: 0
            },
            image: createImage('./img/ghosts.png'),
            spriteColor: 'red'
        }),
        new Ghost({
            position: {
                x: Boundary.width * 6 + Boundary.width / 2,
                y: Boundary.height * 3 + Boundary.height / 2
            },
            velocity: {
                x: Ghost.speed,
                y: 0
            },
            image: createImage('./img/ghosts.png'),
            spriteColor: 'pink'
        })
    ]

    player = new Player({
        position: {
            x: Boundary.width + Boundary.width / 2,
            y: Boundary.height + Boundary.height / 2
        },
        velocity: {
            x: 0,
            y: 0
        }
    })
    keys = {
        w: {
            pressed: false,
        },
        a: {
            pressed: false,
        },
        s: {
            pressed: false,
        },
        d: {
            pressed: false,
        },
    }

    boundaries, pellets, powerUps = buildMap()

}



function circleCollidesWithRectangle({
    circle,
    rectangle
}) {
    const padding = rectangle.width / 2 - circle.radius - 1
    return (
        circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height + padding &&
        circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x - padding &&
        circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y - padding &&
        circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width + padding
    )
}

function animate() {
    if (gameWon === true) {
        selectedMap = Math.floor(maps.length * Math.random())
        while (selectedMap === prevMap) {
            selectedMap = Math.floor(maps.length * Math.random())
        }
        prevMap = selectedMap
        map = maps[selectedMap]
        console.log(selectedMap)
        gameWon = false
        level.innerHTML = selectedMap + 1
        init()
    }
    animationId = requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)

    if (keys.w.pressed && lastkey === 'w') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (circleCollidesWithRectangle({
                circle: {
                    ...player, velocity: {
                        x: 0,
                        y: -speedPlayer
                    }
                },
                rectangle: boundary
            })
            ) {
                player.velocity.y = 0
                break
            } else {
                player.velocity.y = -speedPlayer
            }
        }
    } else if (keys.a.pressed && lastkey === 'a') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (circleCollidesWithRectangle({
                circle: {
                    ...player, velocity: {
                        x: -speedPlayer,
                        y: 0
                    }
                },
                rectangle: boundary
            })
            ) {
                player.velocity.x = 0
                break
            } else {
                player.velocity.x = -speedPlayer
            }
        }
    } else if (keys.s.pressed && lastkey === 's') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (circleCollidesWithRectangle({
                circle: {
                    ...player, velocity: {
                        x: 0,
                        y: speedPlayer
                    }
                },
                rectangle: boundary
            })
            ) {
                player.velocity.y = 0
                break
            } else {
                player.velocity.y = speedPlayer
            }
        }
    } else if (keys.d.pressed && lastkey === 'd') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (circleCollidesWithRectangle({
                circle: {
                    ...player, velocity: {
                        x: speedPlayer,
                        y: 0
                    }
                },
                rectangle: boundary
            })
            ) {
                player.velocity.x = 0
                break
            } else {
                player.velocity.x = speedPlayer
            }
        }
    }

    // detect collision betweeen ghosts and player
    for (let i = ghosts.length - 1; 0 <= i; i--) {
        const ghost = ghosts[i]
        // ghost touches player
        if (
            Math.hypot(ghost.position.x - player.position.x, ghost.position.y - player.position.y) < ghost.radius + player.radius
        ) {
            if (ghost.scared) {
                ghosts.splice(i, 1)
                score += 100
            } else {
                // lose condition
                lost = true
                if (addHighScore === true) {
                    highscores.push(score)
                    console.log('You lose!!!')
                    gameOver.style.display = 'block'
                    highscore.innerHTML = Math.max(...highscores)
                    addHighScore = false
                }                
            }
        }
    }

    // win condition
    if (pellets.length === 0) {
        console.log('you win')
        gameWon = true
    }

    // power ups
    for (let i = powerUps.length - 1; 0 <= i; i--) {
        const powerUp = powerUps[i]
        powerUp.draw()

        if (Math.hypot(powerUp.position.x - player.position.x, powerUp.position.y - player.position.y) < powerUp.radius + player.radius) {
            powerUps.splice(i, 1)

            // make ghosts scared
            ghosts.forEach((ghost) => {
                ghost.scared = true

                setTimeout(() => {
                    ghost.scared = false
                }, 5000)
            })
        }
    }

    // touch pellets here
    for (let i = pellets.length - 1; 0 <= i; i--) {
        const pellet = pellets[i]
        pellet.draw()

        if (Math.hypot(pellet.position.x - player.position.x, pellet.position.y - player.position.y) < pellet.radius + player.radius) {
            pellets.splice(i, 1)
            score += 10
            scoreEl.innerHTML = score
        }
    }

    boundaries.forEach((boundary) => {
        boundary.draw()

        if (circleCollidesWithRectangle({
            circle: player,
            rectangle: boundary
        })
        ) {
            player.velocity.x = 0
            player.velocity.y = 0
        }
    })

    player.update()

    ghosts.forEach((ghost) => {
        ghost.update()

        const collisions = []
        boundaries.forEach((boundary) => {
            if (
                !collisions.includes('right') &&
                circleCollidesWithRectangle({
                    circle: {
                        ...ghost, velocity: {
                            x: ghost.speed,
                            y: 0
                        }
                    },
                    rectangle: boundary
                })
            ) {
                collisions.push('right')
            }
            if (
                !collisions.includes('left') &&
                circleCollidesWithRectangle({
                    circle: {
                        ...ghost, velocity: {
                            x: -ghost.speed,
                            y: 0
                        }
                    },
                    rectangle: boundary
                })
            ) {
                collisions.push('left')
            }
            if (
                !collisions.includes('up') &&
                circleCollidesWithRectangle({
                    circle: {
                        ...ghost, velocity: {
                            x: 0,
                            y: -ghost.speed
                        }
                    },
                    rectangle: boundary
                })
            ) {
                collisions.push('up')
            }
            if (
                !collisions.includes('down') &&
                circleCollidesWithRectangle({
                    circle: {
                        ...ghost, velocity: {
                            x: 0,
                            y: ghost.speed
                        }
                    },
                    rectangle: boundary
                })
            ) {
                collisions.push('down')
            }
        })

        if (collisions.length > ghost.prevCollisions.length) {
            ghost.prevCollisions = collisions
        }

        if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)) {

            if (ghost.velocity.x > 0) ghost.prevCollisions.push('right')
            else if (ghost.velocity.x < 0) ghost.prevCollisions.push('left')
            else if (ghost.velocity.y < 0) ghost.prevCollisions.push('up')
            else if (ghost.velocity.y > 0) ghost.prevCollisions.push('down')

            const pathways = ghost.prevCollisions.filter((collision) => {
                return !collisions.includes(collision)
            })


            const direction = pathways[Math.floor(Math.random() * pathways.length)]
            ghost.sprite = direction

            switch (direction) {
                case 'down':
                    ghost.velocity.y = ghost.speed
                    ghost.velocity.x = 0
                    break
                case 'up':
                    ghost.velocity.y = -ghost.speed
                    ghost.velocity.x = 0
                    break
                case 'right':
                    ghost.velocity.y = 0
                    ghost.velocity.x = ghost.speed
                    break
                case 'left':
                    ghost.velocity.y = 0
                    ghost.velocity.x = -ghost.speed
                    break
            }
            ghost.prevCollisions = []
        }
    })
    if (player.velocity.x > 0) player.rotation = 0
    else if (player.velocity.x < 0) player.rotation = Math.PI
    else if (player.velocity.y > 0) player.rotation = Math.PI / 2
    else if (player.velocity.y < 0) player.rotation = Math.PI * 1.5
}

animate()
