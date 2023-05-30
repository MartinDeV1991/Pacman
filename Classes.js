class Boundary {
    static width = 40
    static height = 40
    constructor({ position, image }) {
        this.position = position
        this.width = 40
        this.height = 40
        this.image = image
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

class Player {
    constructor({ position, velocity }) {
        this.position = position
        this.velocity = velocity
        this.radius = 15
        this.radians = 0.75
        this.openRate = 0.12
        this.rotation = 0
        this.alpha = 1
    }

    draw() {
        c.save()
        c.translate(this.position.x, this.position.y)
        c.rotate(this.rotation)
        c.translate(-this.position.x, -this.position.y)
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, this.radians, 2 * Math.PI - this.radians)
        c.lineTo(this.position.x, this.position.y)
        c.fillStyle = "rgba(255, 255, 0, " + this.alpha + ")"
        c.fill()
        c.closePath()
        c.restore()
    }

    update() {
        this.draw()
        if (lost != true) {
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
            
            if (this.radians < 0 || this.radians > 0.75) this.openRate = -this.openRate

            this.radians += this.openRate
        } else {this.alpha -= 0.005}
    }
}

class Ghost {
    static speed = 2
    constructor({ position, velocity, spriteColor, image }) {
        this.position = position
        this.velocity = velocity
        this.radius = 18
        this.prevCollisions = []
        this.speed = 2
        this.scared = false
        this.image = image
        this.cropHeight = 187.5
        this.cropWidth = 182.5
        this.sprite = 'right'
        this.spriteColor = spriteColor
        this.spriteCol = 0
        this.spriteRow = 0
        this.spriteColorOffsetX = 0
        this.spriteColorOffsetY = 0
    }

    draw() {

        switch (this.spriteColor) {
            case 'red':
                this.spriteColorOffsetX = 0 * this.cropWidth * 2
                this.spriteColorOffsetY = 0 * this.cropHeight * 2
                break
            case 'pink':
                this.spriteColorOffsetX = 0 * this.cropWidth * 2
                this.spriteColorOffsetY = 1 * this.cropHeight * 2
                break
            case 'orange':
                this.spriteColorOffsetX = 1 * this.cropWidth * 2
                this.spriteColorOffsetY = 1 * this.cropHeight * 2
                break
            case 'blue':
                this.spriteColorOffsetX = 1 * this.cropWidth * 2
                this.spriteColorOffsetY = 0 * this.cropHeight * 2
                break
        }

        switch (this.sprite) {
            case 'down':
                this.spriteCol = 1
                this.spriteRow = 0
                break
            case 'up':
                this.spriteCol = 0
                this.spriteRow = 1
                break
            case 'right':
                this.spriteCol = 0
                this.spriteRow = 0
                break
            case 'left':
                this.spriteCol = 1
                this.spriteRow = 1
                break
        }

        if (this.scared) {
        c.drawImage(this.image,
            this.cropWidth * 2 + this.spriteRow * this.cropWidth, 0 * this.cropHeight * 2 + this.spriteCol * this.cropHeight, this.cropHeight, this.cropWidth,
            this.position.x - 15, this.position.y - 15, this.radius * 2, this.radius * 2)
        } else {
        c.drawImage(this.image,
            this.spriteColorOffsetX + this.spriteRow * this.cropWidth, this.spriteColorOffsetY + this.spriteCol * this.cropHeight, this.cropHeight, this.cropWidth,
            this.position.x - 15, this.position.y - 15, this.radius * 2, this.radius * 2)
        }

        // c.beginPath()
        // c.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI)
        // c.fillStyle = this.scared ? 'blue' : this.color
        // c.fill()
        // c.closePath()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Pellet {
    constructor({ position }) {
        this.position = position
        this.radius = 3
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI)
        c.fillStyle = 'white'
        c.fill()
        c.closePath()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class PowerUp {
    constructor({ position }) {
        this.position = position
        this.radius = 8
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI)
        c.fillStyle = 'white'
        c.fill()
        c.closePath()
    }
}

function createImage(src) {
    const image = new Image()
    image.src = src
    return image
}