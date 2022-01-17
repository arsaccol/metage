import * as THREE from 'three'

class GameState
{
    constructor()
    {
        this.players = {}
    }


    onClientSpawnRequest(socket)
    {
        console.log(`Spawning new player with ID: ${socket.id}!`)

        const newPlayerObject3D = new THREE.Object3D()
        newPlayerObject3D.position.set(Math.random() * 10 - 5, 1, Math.random() * 10 - 5)
        newPlayerObject3D.lookAt(new THREE.Vector3())
        newPlayerObject3D.rotateY(Math.PI)

        this.players[socket.id] = newPlayerObject3D
        const {position, quaternion} = {...newPlayerObject3D}

        const stateOfExistingPlayers = Object.keys(this.players).filter(id => id !== socket.id).map( id => {
            const { position, quaternion } = this.players[id]
            return {
                id: id,
                position: position,
                quaternion: quaternion
            }
        } )

        socket.emit('server:spawn-response', {spawnedPlayer: {position: position, quaternion: quaternion}, existingPlayers: stateOfExistingPlayers})

        console.log(`Players connected: [${Object.keys(this.players)}]`)
        socket.broadcast.emit('other-clients:spawn-broadcast', {id: socket.id, position: position, quaternion: quaternion})
    }
}

export default GameState
